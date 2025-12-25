import Link from 'next/link';

import connectToDatabase from "@/lib/db";
import Product, { IProduct } from "@/models/Product";

import DeleteProductButton from './DeleteProductButton';

// Ensures the page is always rendered dynamically (no static caching)
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // 1. Connect to the DB
  await connectToDatabase();

  // 2. Fetch all products
  // .lean() returns plain JavaScript objects instead of Mongoose Documents (faster & lighter)
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>

        <Link 
            href="/admin/products/new" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
          + Add Product
        </Link>
        <span className="text-gray-500 text-sm">
          Total Products: {products.length}
        </span>
      </div>

      {/* 3. Handle Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        /* 4. Display Data Table */
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr 
                  key={product._id.toString()} 
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock > 0 ? (
                      <span className="text-green-600 font-semibold">{product.stock} in stock</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Out of stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                          href={`/admin/products/${product._id}/edit`} 
                          className="font-medium text-blue-600 hover:underline mr-4"
                    >
                    Edit
                    </Link>
                    <DeleteProductButton id={product._id.toString()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}