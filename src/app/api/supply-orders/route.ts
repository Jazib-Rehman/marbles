import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import SupplyOrder from "@/models/SupplyOrder";
import { CustomerModel } from "@/models/Customer";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Payment from "@/models/Payment";

// Generate order number
function generateOrderNumber() {
  const prefix = 'SO';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");

    if (id) {
      const order = await SupplyOrder.findById(id)
        .populate('customer', 'businessName firstName lastName phone email')
        .populate({
          path: 'customerPayments',
          select: 'amount paymentMethod paymentDate reference notes'
        });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    let query = {};
    if (search) {
      query = {
        $or: [
          { orderNumber: { $regex: search, $options: 'i' } },
          { factoryName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const orders = await SupplyOrder.find(query)
      .populate('customer', 'businessName firstName lastName')
      .populate({
        path: 'customerPayments',
        select: 'amount paymentMethod paymentDate reference notes'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching supply orders:", error);
    return NextResponse.json(
      { error: "Error fetching supply orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['customer', 'factoryName', 'items', 'deliveryAddress'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create new supply order
    const newOrder = await SupplyOrder.create({
      ...body,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const populatedOrder = await SupplyOrder.findById(newOrder._id)
      .populate('customer', 'businessName firstName lastName phone email');

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating supply order:", error);
    return NextResponse.json(
      { error: "Error creating supply order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await SupplyOrder.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json();

    switch (action) {
      case 'status':
        order.status = body.status;
        break;

      case 'factory-payment':
        order.factoryPayments.push(body);
        order.paidToFactory += body.amount;

        if (order.paidToFactory >= order.totalPurchaseAmount) {
          order.factoryPaymentStatus = 'Paid';
        } else if (order.paidToFactory > 0) {
          order.factoryPaymentStatus = 'Partially Paid';
        }

        // Auto update order status
        if (order.factoryPaymentStatus === 'Paid' && order.customerPaymentStatus === 'Paid') {
          order.status = 'Completed';
        } else if (order.factoryPaymentStatus === 'Paid' || order.customerPaymentStatus === 'Paid' ||
                  order.factoryPaymentStatus === 'Partially Paid' || order.customerPaymentStatus === 'Partially Paid') {
          order.status = 'Processing';
        }
        break;

      case 'customer-payment':
        const payment = await Payment.create({
          ...body,
          order: order._id
        });

        order.customerPayments.push(payment._id);
        order.receivedFromCustomer += body.amount;

        if (order.receivedFromCustomer >= order.totalSaleAmount) {
          order.customerPaymentStatus = 'Paid';
        } else if (order.receivedFromCustomer > 0) {
          order.customerPaymentStatus = 'Partially Paid';
        }

        // Auto update order status
        if (order.factoryPaymentStatus === 'Paid' && order.customerPaymentStatus === 'Paid') {
          order.status = 'Completed';
        } else if (order.factoryPaymentStatus === 'Paid' || order.customerPaymentStatus === 'Paid' ||
                  order.factoryPaymentStatus === 'Partially Paid' || order.customerPaymentStatus === 'Partially Paid') {
          order.status = 'Processing';
        }
        break;

      default:
        // Handle general updates
        Object.assign(order, body);
    }

    order.updatedAt = new Date();
    await order.save();

    const populatedOrder = await SupplyOrder.findById(order._id)
      .populate('customer', 'businessName firstName lastName')
      .populate('customerPayments');

    return NextResponse.json(populatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Error updating order" }, { status: 500 });
  }
} 