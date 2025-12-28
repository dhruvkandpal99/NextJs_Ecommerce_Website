import Link from 'next/link';
import Image from 'next/image';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
// 1. Import the Client Component
import BuyButton from '@/components/BuyButton'; 

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();
  
  // 2. Fetch Raw Data
  const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

  // 3. 🧹 SANITIZE: Convert MongoDB Objects to plain Strings
  // This prevents the "Functions cannot be passed to Client Components" crash.
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- 1. Minimalist Navbar --- */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight text-slate-900">
            Standard<span className="text-blue-600">Electronics</span>.
          </div>
          <Link 
            href="/login" 
            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            Admin Access
          </Link>
        </div>
      </header>

      {/* --- 2. Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-white"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            New Collection 2025
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Technology, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Simplified.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to <strong>Standard Electronics</strong>. We curate the finest tech so you don't have to. 
            Premium quality, verified durability, and designs that stand out.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#collection" className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Shop Now
            </a>
            <button className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-gray-50 transition-all">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* --- 3. Trust/Services Bar --- */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="font-semibold text-slate-900">Official Warranty</h3>
              <p className="text-sm text-slate-500 mt-1">100% Authentic products.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="font-semibold text-slate-900">Express Delivery</h3>
              <p className="text-sm text-slate-500 mt-1">Same-day dispatch available.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="font-semibold text-slate-900">24/7 Support</h3>
              <p className="text-sm text-slate-500 mt-1">We are here when you need us.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. Product Grid --- */}
      <main id="collection" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Arrivals</h2>
            <p className="text-slate-500 mt-1">Curated just for you.</p>
          </div>
          <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All &rarr;</a>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-slate-400">Inventory is currently being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Standard Electronics. Designed for quality.</p>
        </div>
      </footer>
    </div>
  );
}

// --- Product Card Component ---
function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden h-[400px]">
      
      {/* Image */}
      <div className="relative h-56 w-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
           <Image
             src={product.imageUrl}
             alt={product.title}
             fill
             className="object-contain mix-blend-multiply" 
           />
        </div>
        <span className="absolute top-4 left-4 bg-white/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-slate-800 border border-gray-100">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-900 truncate pr-4">{product.title}</h3>
          <span className="font-bold text-blue-600">${product.price}</span>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-white/95 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex flex-col gap-3">
  
          <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </span>
          </div>
            
          {/* 4. Buy Botton*/}
          <BuyButton product={product} />

        </div>
      </div>
    </div>
  );
}