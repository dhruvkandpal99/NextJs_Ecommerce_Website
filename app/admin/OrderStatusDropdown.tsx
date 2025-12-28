'use client';

import { updateOrderStatus } from '@/lib/actions';
import { useTransition } from 'react';

export default function OrderStatusDropdown({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateOrderStatus(id, newStatus);
    });
  };

  const getColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <select 
      value={currentStatus} 
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-semibold px-2 py-1 rounded border-0 cursor-pointer focus:ring-2 ring-blue-500 ${getColor(currentStatus)} ${isPending ? 'opacity-50' : ''}`}
    >
      <option value="PENDING">Pending</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}