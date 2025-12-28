'use client';

import { buyProduct } from "@/lib/actions";
import { useTransition } from "react";

export default function BuyButton({ product }: { product: any }) {
  const [isPending, startTransition] = useTransition();

  const handleBuy = () => {
    startTransition(async () => {
      const result = await buyProduct(product._id);
      if (!result.success) {
        alert(result.message); // Simple feedback
      }
    });
  };

  if (product.stock === 0) {
    return (
      <button disabled className="w-full py-2 bg-gray-300 text-white rounded cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  return (
    <button 
      onClick={handleBuy}
      disabled={isPending}
      className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-70 transition"
    >
      {isPending ? 'Processing...' : 'Buy Now'}
    </button>
  );
}