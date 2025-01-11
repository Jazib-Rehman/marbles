import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import Inventory from "@/models/Inventory";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// GET all orders with optional filters
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const customerType = searchParams.get("customerType") as "B2B" | "B2C" | null;
    
    let query: any = {};

    // Add filters if provided
    if (status) {
      query.status = status;
    }
    if (customerType) {
      query.customerType = customerType;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerContact: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'businessName firstName lastName')
      .populate('items.inventory', 'marbleType size');

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// POST new order
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Get user ID from token
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate unique order number
    let orderNumber;
    let isUnique = false;
    while (!isUnique) {
      const prefix = 'ORD-';
      const randomPart = Math.floor(Math.random() * 999999).toString().padStart(6, '0').replace(/\d/g, function() {
        return Math.random() < 0.5 ? 'a' : 'A';
      });
      orderNumber = `${prefix}${randomPart}`;
      const existingOrder = await Order.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
      console.log({orderNumber});
    }

    // Validate required fields
    const requiredFields = ["customer", "items", "deliveryAddress"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Get customer details
    const customer = await CustomerModel.findById(body.customer);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Validate and process items
    for (const item of body.items) {
      // Check inventory exists and has sufficient quantity
      const inventoryItem = await Inventory.findById(item.inventory);
      if (!inventoryItem) {
        return NextResponse.json(
          { error: `Inventory item not found: ${item.inventory}` },
          { status: 404 }
        );
      }

      if (inventoryItem.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for ${inventoryItem.marbleType} (${inventoryItem.size})` },
          { status: 400 }
        );
      }

      // Cache inventory details
      item.marbleType = inventoryItem.marbleType;
      item.size = inventoryItem.size;
      item.ratePerFoot = item.ratePerFoot || inventoryItem.saleRate;
      item.totalAmount = item.quantity * item.ratePerFoot;

      // Update inventory quantity
      await Inventory.findByIdAndUpdate(item.inventory, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Create order with calculated total and generated order number
    const orderData = {
      ...body,
      orderNumber,
      totalAmount: body.items.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.ratePerFoot), 0
      ),
      customerType: customer.customerType,
      customerName: customer.customerType === "B2B" 
        ? customer.businessName 
        : `${customer.firstName} ${customer.lastName}`,
      customerContact: customer.phone,
      createdBy: userId,
    };

    const newOrder = await Order.create(orderData);

    // Update customer's total orders and spent
    await CustomerModel.findByIdAndUpdate(customer._id, {
      $inc: {
        totalOrders: 1,
        totalSpent: newOrder.totalAmount
      }
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
} 