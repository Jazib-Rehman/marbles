import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import Inventory from "@/models/Inventory";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get total orders count and amounts
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      unpaidAmount
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Completed" }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$remainingAmount" } } }
      ])
    ]);

    // Get customer counts
    const [totalB2BCustomers, totalB2CCustomers] = await Promise.all([
      CustomerModel.countDocuments({ customerType: "B2B" }),
      CustomerModel.countDocuments({ customerType: "B2C" })
    ]);

    // Get low stock items
    const lowStockItems = await Inventory.countDocuments({
      quantity: { $lte: 100 }
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'businessName firstName lastName')
      .select('orderNumber customerName totalAmount status createdAt');

    // Get top customers
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          customerName: { $first: "$customerName" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    // Get sales by status
    const salesByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Get monthly revenue data for the last 6 months
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);

    // Get order distribution by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format monthly revenue data
    const revenueData = monthlyRevenue.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      revenue: item.revenue
    }));

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        unpaidAmount: unpaidAmount[0]?.total || 0,
        totalB2BCustomers,
        totalB2CCustomers,
        lowStockItems
      },
      recentOrders,
      topCustomers,
      salesByStatus,
      revenueData,
      ordersByStatus
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
} 