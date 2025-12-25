'use client'

import { useTransition } from 'react';
import { deleteProduct } from '@/lib/actions';

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    
    if (confirmed) {
      startTransition(async () => {
        await deleteProduct(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`font-medium text-red-600 hover:underline ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}