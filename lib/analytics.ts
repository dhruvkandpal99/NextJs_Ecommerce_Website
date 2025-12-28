import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function getDashboardStats() {
  await connectToDatabase();

  const revenueOverTime = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$amount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const ordersOverTime = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const topProducts = await Product.find({})
    .sort({ soldCount: -1 })
    .limit(5)
    .select('title soldCount')
    .lean();

  const categoryRevenue = await Order.aggregate([
    {
      $group: {
        _id: "$category",
        value: { $sum: "$amount" }
      }
    }
  ]);

  const statusDist = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        value: { $sum: 1 }
      }
    }
  ]);

  const lowStockProducts = await Product.find({ stock: { $lt: 50 } })
    .select('title stock')
    .lean();

  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const data = {
    revenueOverTime,
    ordersOverTime,
    topProducts,
    categoryRevenue,
    statusDist,
    lowStockProducts,
    recentOrders,
  };

  return JSON.parse(JSON.stringify(data));
}