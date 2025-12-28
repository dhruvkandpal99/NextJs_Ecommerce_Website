import { getDashboardStats } from "@/lib/analytics";
import AdminCharts from "./AdminCharts";
import OrderStatusDropdown from "./OrderStatusDropdown";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  
  // This is now guaranteed to be clean JSON
  const stats = await getDashboardStats();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session?.user?.name}</p>
        </div>
      </div>

      <AdminCharts data={stats} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.productName}</td>
                  <td className="px-6 py-4">{order.category}</td>
                  <td className="px-6 py-4">${order.amount}</td>
                  <td className="px-6 py-4">
                    {/* The date is already a string now, so we pass it to Date() */}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusDropdown 
                      id={order._id} 
                      currentStatus={order.status} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}