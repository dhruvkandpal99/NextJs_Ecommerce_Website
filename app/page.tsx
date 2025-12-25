import Link from 'next/link';
import Image from 'next/image';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

// Force dynamic rendering so new products appear immediately
export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();
  
  // Fetch all products, sorted by newest first
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- Header / Navigation --- */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Standard Electronics</span>
          </div>

          {/* Admin Login Button */}
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Admin Login &rarr;
          </Link>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">New Arrivals</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out our latest collection. Hover over any item to reveal more details.
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Standard Electronics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Helper Component for the Card Logic
function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl hover:z-10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 overflow-hidden h-[350px] cursor-default border border-gray-100">
      
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded text-gray-700">
          {product.category}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col h-full bg-white relative">
        {/* Initial View (Always Visible) */}
        <div className="mb-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h3>
            <span className="text-lg font-bold text-green-600">${product.price}</span>
          </div>
        </div>

        {/* Hover Details (Slides up/Fades in) */}
        {/* We use absolute positioning to overlay the description on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
             <span className={`text-xs font-medium px-2 py-1 rounded ${
               product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
               {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}