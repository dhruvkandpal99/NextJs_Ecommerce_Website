import mongoose, { Schema, model, models, Document } from 'mongoose';

// 1. Define the TypeScript Interface
export interface IProduct extends Document {
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  soldCount: number;
}

// 2. Define the Schema
const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this product'],
      maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      default: 0,
    },
    soldCount: { type: Number, default: 0 },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 3. Create and export the model
// The "models.Product || ..." check is crucial in Next.js to prevent model overwriting errors
const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;