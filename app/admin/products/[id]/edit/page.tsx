import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import EditProductForm from "./EditProductForm";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = params;

  await connectToDatabase();
  
  // Use .lean() to get a plain JS object, easier to pass to client components
  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  // Convert _id to string to avoid serialization issues
  const plainProduct = {
    ...product,
    _id: product._id.toString(),
  };

  return (
    <div className="p-8">
      <EditProductForm product={plainProduct} />
    </div>
  );
}