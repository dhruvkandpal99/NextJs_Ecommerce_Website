'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProduct } from '@/lib/actions';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from 'next/navigation';

// Define Schema
const formSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  price: z.coerce.number().min(0.01, "Price must be > 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid URL"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is too short"),
});

interface EditProductFormProps {
  product: any;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Note: No <FormValues> generic here to allow z.coerce to work freely
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: product.title,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: product.category,
      description: product.description,
    },
  });

  const imageUrl = watch('imageUrl');

  const setCustomValue = (id: string, value: any) => {
    setValue(id as any, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await updateProduct(product._id, data);
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input {...register('title')} className="w-full border p-2 rounded" />
          {errors.title?.message && (
            <p className="text-red-500 text-sm">{String(errors.title.message)}</p>
          )}
        </div>

        {/* Row for Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input type="number" step="0.01" {...register('price')} className="w-full border p-2 rounded" />
            {errors.price?.message && (
              <p className="text-red-500 text-sm">{String(errors.price.message)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" {...register('stock')} className="w-full border p-2 rounded" />
            {errors.stock?.message && (
              <p className="text-red-500 text-sm">{String(errors.stock.message)}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select {...register('category')} className="w-full border p-2 rounded">
            <option value="">Select a category</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops & Computers">Laptops & Computers</option>
            <option value="Smart Watches & Wearables">Smart Watches & Wearables</option>
            <option value="Headphones & Audio">Headphones & Audio</option>
            <option value="Cameras & Photography">Cameras & Photography</option>
            <option value="Gaming & Consoles">Gaming & Consoles</option>
            <option value="Accessories">Accessories</option>
          </select>
          {errors.category?.message && (
            <p className="text-red-500 text-sm">{String(errors.category.message)}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Image</label>
          <ImageUpload 
            value={imageUrl} 
            onChange={(image) => setCustomValue('imageUrl', image)} 
          />
          {errors.imageUrl?.message && (
            <p className="text-red-500 text-sm">{String(errors.imageUrl.message)}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} className="w-full border p-2 rounded h-24" />
          {errors.description?.message && (
            <p className="text-red-500 text-sm">{String(errors.description.message)}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
            <button 
            type="button"
            onClick={() => router.back()}
            className="w-1/3 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
            >
            Cancel
            </button>
            <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-2/3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
            {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
}