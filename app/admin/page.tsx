import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import DashboardChart from "./DashboardChart";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectToDatabase();
  const session = await auth();

  // Fetch data
  const products = await Product.find({}).lean();
  
  const totalProducts = products.length;
  const totalStockValue = products.reduce((acc, p: any) => acc + (p.price * p.stock), 0);
  
  // Prepare chart data (Top 10 products by stock)
  const chartData = products
    .map((p: any) => ({ name: p.title.substring(0, 15), stock: p.stock }))
    .slice(0, 10);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hello, {session?.user?.name}</h1>
        <p className="text-gray-500">Here is your store overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Inventory Value</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${totalStockValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <DashboardChart data={chartData} />
    </div>
  );
}