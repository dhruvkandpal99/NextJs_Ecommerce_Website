'use server'

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 1. Define Zod Schema (matching Mongoose requirements)
const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Please enter a valid URL"),
  // Added these because your DB requires them
  category: z.string().min(1, "Category is required"), 
  description: z.string().min(10, "Description must be at least 10 characters"), 
});

// 2. The Server Action
export async function createProduct(data: z.infer<typeof ProductSchema>) {
  // Validate data on the server side just in case
  const validation = ProductSchema.safeParse(data);

  if (!validation.success) {
    throw new Error("Server validation failed");
  }

  await connectToDatabase();

  await Product.create(validation.data);

  // Clear cache for the products page so the new item shows up
  revalidatePath('/admin/products');
  
  // Redirect back to list
  redirect('/admin/products');
}


export async function updateProduct(id: string, data: z.infer<typeof ProductSchema>) {
  const validation = ProductSchema.safeParse(data);

  if (!validation.success) {
    throw new Error("Server validation failed");
  }

  await connectToDatabase();

  // Find the existing product to check if image changed (for cleanup)
  const product = await Product.findById(id);
  
  if (!product) throw new Error("Product not found");


  await Product.findByIdAndUpdate(id, validation.data);

  revalidatePath('/admin/products');
  revalidatePath('/'); // Update homepage
  redirect('/admin/products');
}


export async function deleteProduct(id: string) {
  try {
    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.imageUrl) {
      const publicId = getPublicIdFromUrl(product.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    
    // Perform the deletion
    await Product.findByIdAndDelete(id);

    // Trigger a refresh of the products page so the data updates immediately
    revalidatePath('/admin/products');
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false, 
    });
  } catch (error) {
    console.log("🔴 Signin Error caught:", error); // DEBUG LOG
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
  redirect('/admin');
}

function getPublicIdFromUrl(url: string) {
  // Cloudinary URLs look like: 
  // https://res.cloudinary.com/.../upload/v12345/folder/image_name.jpg
  // We want: folder/image_name
  
  try {
    const parts = url.split('/');
    const lastPart = parts.pop(); // image_name.jpg
    const publicId = lastPart?.split('.')[0]; // image_name
    return publicId;
  } catch (error) {
    return null;
  }
}