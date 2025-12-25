import { signOut } from "@/auth";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Top Navigation Bar --- */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        
        {/* Left: Logo / Title */}
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-xl font-bold text-blue-600">
            Store Admin
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4 text-sm font-medium text-gray-600">
            <Link href="/admin" className="hover:text-black hover:underline">
              Overview
            </Link>
            <Link href="/admin/products" className="hover:text-black hover:underline">
              Products (Add/Edit)
            </Link>
          </div>
        </div>

        {/* Right: Logout Button */}
        <div>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition">
              Logout
            </button>
          </form>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main>
        {children}
      </main>
    </div>
  );
}