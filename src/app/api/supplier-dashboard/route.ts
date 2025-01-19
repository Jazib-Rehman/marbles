import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import SupplyTransaction from "@/models/SupplyTransaction";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get total transactions count and amounts
    const [
      totalIncoming,
      totalOutgoing,
      pendingIncoming,
      pendingOutgoing,
      completedIncoming,
      completedOutgoing,
      totalExpense,
      totalRevenue,
      unpaidReceivables,
      unpaidPayables
    ] = await Promise.all([
      SupplyTransaction.countDocuments({ transactionType: 'INCOMING' }),
      SupplyTransaction.countDocuments({ transactionType: 'OUTGOING' }),
      SupplyTransaction.countDocuments({ transactionType: 'INCOMING', status: "Pending" }),
      SupplyTransaction.countDocuments({ transactionType: 'OUTGOING', status: "Pending" }),
      SupplyTransaction.countDocuments({ transactionType: 'INCOMING', status: "Completed" }),
      SupplyTransaction.countDocuments({ transactionType: 'OUTGOING', status: "Completed" }),
      SupplyTransaction.aggregate([
        { $match: { transactionType: 'INCOMING' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      SupplyTransaction.aggregate([
        { $match: { transactionType: 'OUTGOING' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      SupplyTransaction.aggregate([
        { $match: { transactionType: 'OUTGOING' } },
        { $group: { _id: null, total: { $sum: "$remainingAmount" } } }
      ]),
      SupplyTransaction.aggregate([
        { $match: { transactionType: 'INCOMING' } },
        { $group: { _id: null, total: { $sum: "$remainingAmount" } } }
      ])
    ]);

    // Get recent transactions
    const recentTransactions = await SupplyTransaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber businessParty totalAmount status transactionType createdAt');

    // Get top business parties
    const topParties = await SupplyTransaction.aggregate([
      {
        $group: {
          _id: {
            name: "$businessParty.name",
            type: "$transactionType"
          },
          totalAmount: { $sum: "$totalAmount" },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    // Get monthly trends
    const monthlyTrends = await SupplyTransaction.aggregate([
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
            month: { $month: "$createdAt" },
            type: "$transactionType"
          },
          amount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return NextResponse.json({
      stats: {
        incoming: {
          total: totalIncoming,
          pending: pendingIncoming,
          completed: completedIncoming,
          expense: totalExpense[0]?.total || 0,
          unpaidPayables: unpaidPayables[0]?.total || 0,
        },
        outgoing: {
          total: totalOutgoing,
          pending: pendingOutgoing,
          completed: completedOutgoing,
          revenue: totalRevenue[0]?.total || 0,
          unpaidReceivables: unpaidReceivables[0]?.total || 0,
        }
      },
      recentTransactions,
      topParties,
      monthlyTrends: monthlyTrends.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        type: item._id.type,
        amount: item.amount
      }))
    });
  } catch (error) {
    console.error("Error fetching supplier dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching supplier dashboard data" },
      { status: 500 }
    );
  }
} 