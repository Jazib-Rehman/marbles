import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import Inventory from "@/models/Inventory";

// GET single order
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const order = await Order.findById(context.params.id)
      .populate('customer', 'businessName firstName lastName phone email address')
      .populate('items.inventory', 'marbleType size quantity');

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    // Find existing order
    const existingOrder = await Order.findById(context.params.id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // If updating status to "Cancelled", restore inventory quantities
    if (body.status === "Cancelled" && existingOrder.status !== "Cancelled") {
      for (const item of existingOrder.items) {
        await Inventory.findByIdAndUpdate(item.inventory, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    // If adding new payment
    if (body.payments) {
      existingOrder.payments.push(...body.payments);
      await existingOrder.save();  // This will trigger payment calculations
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      context.params.id,
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

// DELETE order (soft delete or with restrictions)
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const order = await Order.findById(context.params.id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of pending orders
    if (order.status !== "Pending") {
      return NextResponse.json(
        { error: "Only pending orders can be deleted" },
        { status: 400 }
      );
    }

    // Restore inventory quantities
    for (const item of order.items) {
      await Inventory.findByIdAndUpdate(item.inventory, {
        $inc: { quantity: item.quantity }
      });
    }

    // Update customer's total orders and spent
    await CustomerModel.findByIdAndUpdate(order.customer, {
      $inc: {
        totalOrders: -1,
        totalSpent: -order.totalAmount
      }
    });

    await Order.findByIdAndDelete(context.params.id);

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting order" },
      { status: 500 }
    );
  }
} 