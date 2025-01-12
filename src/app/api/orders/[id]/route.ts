import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "../../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import Inventory from "@/models/Inventory";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const order = await Order.findById(params.id)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const existingOrder = await Order.findById(params.id);
        if (!existingOrder) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
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
            params.id,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
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

        await Order.findByIdAndDelete(params.id);

        return NextResponse.json({ message: "Order deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Error deleting order" },
            { status: 500 }
        );
    }
} 