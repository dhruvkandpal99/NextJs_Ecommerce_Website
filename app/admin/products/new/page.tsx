'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProduct } from '@/lib/actions';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

// Define the schema (same as server for client-side feedback)
const formSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  price: z.coerce.number().min(0.01, "Price must be > 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid URL"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is too short"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,    
    formState: { errors },
    } = useForm({
    resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            price: 0,
            stock: 0,
            imageUrl: "",
            category: "",
            description: "",
        },
    });

  // Watch the imageUrl so the UI updates when it changes
  const imageUrl = watch('imageUrl');

  // Custom handler to update form state when image is uploaded
  const setCustomValue = (id: 'imageUrl', value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await createProduct(data);
      // Redirect happens in the action, so no code needed here
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input {...register('title')} className="w-full border p-2 rounded" placeholder="Product Name" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Row for Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="w-full border p-2 rounded" />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" {...register('stock', { valueAsNumber: true })} className="w-full border p-2 rounded" />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
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
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* ImageUpload */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Image</label>
          <ImageUpload 
            value={imageUrl} 
            onChange={(image) => setCustomValue('imageUrl', image)} 
          />
          {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} className="w-full border p-2 rounded h-24" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}