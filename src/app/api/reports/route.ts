import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly"; // monthly, yearly, weekly
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateMatch = {};
    if (startDate && endDate) {
      dateMatch = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    // Sales Overview
    const salesOverview = await Order.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          paidAmount: { $sum: "$paidAmount" },
          remainingAmount: { $sum: "$remainingAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    // Sales by Status
    const salesByStatus = await Order.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Sales by Customer Type
    const salesByCustomerType = await Order.aggregate([
      { $match: dateMatch },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      { $unwind: "$customerInfo" },
      {
        $group: {
          _id: "$customerInfo.customerType",
          totalAmount: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    // Top Products
    const topProducts = await Order.aggregate([
      { $match: dateMatch },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.marbleType",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.ratePerFoot"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    // Sales Trend
    const salesTrend = await Order.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalAmount: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return NextResponse.json({
      salesOverview: salesOverview[0] || {
        totalSales: 0,
        totalOrders: 0,
        paidAmount: 0,
        remainingAmount: 0,
        averageOrderValue: 0,
      },
      salesByStatus,
      salesByCustomerType,
      topProducts,
      salesTrend: salesTrend.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        amount: item.totalAmount,
        orders: item.orderCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { error: "Error fetching report data" },
      { status: 500 }
    );
  }
} 