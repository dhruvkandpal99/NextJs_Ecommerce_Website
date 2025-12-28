'use server'

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { getPublicIdFromUrl } from '@/lib/utils';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import Order from '@/models/Order';


// 1. Define Zod Schema (matching Mongoose requirements)
const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Please enter a valid URL"),
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
     const cloudinary = (await import('@/lib/cloudinary')).default;

  await connectToDatabase();

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  if (product.imageUrl) {
    const publicId = getPublicIdFromUrl(product.imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  await Product.findByIdAndDelete(id);
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

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function buyProduct(productId: string): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return { success: false, message: "Product not found" };
    }
    
    if (product.stock < 1) {
      return { success: false, message: "Out of stock" };
    }

    // Logic
    product.stock -= 1;
    product.soldCount += 1;
    await product.save();

    await Order.create({
      productId: product._id,
      productName: product.title,
      amount: product.price,
      category: product.category || "General",
      status: 'PENDING'
    });

    revalidatePath('/');
    revalidatePath('/admin');
    
    // ✅ SUCCESS RETURN
    return { success: true, message: "Order placed successfully" };

  } catch (error) {
    console.error("Buy Error:", error);
    // ✅ ERROR RETURN
    return { success: false, message: "Internal Server Error" };
  }
}

// 2. Update Order Status Action (For Admin)
export async function updateOrderStatus(orderId: string, newStatus: string) {
  await connectToDatabase();
  await Order.findByIdAndUpdate(orderId, { status: newStatus });
  revalidatePath('/admin');
}