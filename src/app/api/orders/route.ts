import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import Inventory from "@/models/Inventory";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const order = await Order.findById(id)
        .populate('customer', 'businessName firstName lastName phone email address')
        .populate('items.inventory', 'marbleType size quantity');

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(order);
    }

    // List orders (existing code)
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const customerType = searchParams.get("customerType");

    let query: any = {};
    if (status) query.status = status;
    if (customerType) query.customerType = customerType;
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
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (body.status === "Cancelled" && existingOrder.status !== "Cancelled") {
      for (const item of existingOrder.items) {
        await Inventory.findByIdAndUpdate(item.inventory, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    if (body.payments) {
      existingOrder.payments.push(...body.payments);
      await existingOrder.save();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Pending") {
      return NextResponse.json(
        { error: "Only pending orders can be deleted" },
        { status: 400 }
      );
    }

    for (const item of order.items) {
      await Inventory.findByIdAndUpdate(item.inventory, {
        $inc: { quantity: item.quantity }
      });
    }

    await CustomerModel.findByIdAndUpdate(order.customer, {
      $inc: {
        totalOrders: -1,
        totalSpent: -order.totalAmount
      }
    });

    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting order" },
      { status: 500 }
    );
  }
} 