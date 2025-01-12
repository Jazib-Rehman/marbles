import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Order from "@/models/Order";
import { CustomerModel } from "@/models/Customer";
import Inventory from "@/models/Inventory";
import { getDataFromToken } from "@/helpers/getDataFromToken";

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

    // Handle order cancellation
    if (body.status === "Cancelled" && existingOrder.status !== "Cancelled") {
      // Return items to inventory
      for (const item of existingOrder.items) {
        await Inventory.findByIdAndUpdate(item.inventory, {
          $inc: { quantity: item.quantity }
        });
      }

      // Update customer stats
      await CustomerModel.findByIdAndUpdate(existingOrder.customer, {
        $inc: {
          totalOrders: -1,
          totalSpent: -existingOrder.totalAmount
        }
      });
    }

    // Handle payments
    if (body.payments) {
      const newPayments = Array.isArray(body.payments) ? body.payments : [body.payments];

      // Calculate new paid amount
      const totalPaid = [...existingOrder.payments, ...newPayments]
        .reduce((sum, payment) => sum + payment.amount, 0);

      // Update payment related fields
      body.paidAmount = totalPaid;
      body.remainingAmount = existingOrder.totalAmount - totalPaid;
      body.paymentStatus = totalPaid === 0 ? "Unpaid"
        : totalPaid < existingOrder.totalAmount ? "Partially Paid"
          : "Paid";

      existingOrder.payments.push(...newPayments);
      await existingOrder.save();
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('customer', 'businessName firstName lastName phone email address')
      .populate('items.inventory', 'marbleType size quantity');

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get customer details
    const customer = await CustomerModel.findById(body.customer);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Set customer details for historical record
    const customerName = customer.customerType === "B2B"
      ? customer.businessName
      : `${customer.firstName} ${customer.lastName}`;
    const customerContact = customer.phone;

    // Process items and validate inventory
    let totalAmount = 0;
    const processedItems = [];

    for (const item of body.items) {
      const inventory = await Inventory.findById(item.inventory);
      if (!inventory) {
        return NextResponse.json(
          { error: `Inventory item not found: ${item.inventory}` },
          { status: 404 }
        );
      }

      if (inventory.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for ${inventory.marbleType}` },
          { status: 400 }
        );
      }

      // Create order item with cached inventory details
      const orderItem = {
        inventory: item.inventory,
        marbleType: inventory.marbleType,
        size: inventory.size,
        quantity: item.quantity,
        ratePerFoot: item.ratePerFoot || inventory.saleRate,
        totalAmount: (item.ratePerFoot || inventory.saleRate) * item.quantity
      };

      totalAmount += orderItem.totalAmount;
      processedItems.push(orderItem);

      // Update inventory
      await Inventory.findByIdAndUpdate(item.inventory, {
        $inc: { quantity: -item.quantity },
        $set: {
          status: inventory.quantity - item.quantity <= 0 ? "Out of Stock"
            : inventory.quantity - item.quantity <= 100 ? "Low Stock"
              : "In Stock"
        }
      });
    }

    // Create order with all required fields
    const newOrder = await Order.create({
      orderNumber: `ORD${Date.now()}`,
      customer: body.customer,
      customerType: customer.customerType,
      customerName,
      customerContact,
      items: processedItems,
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      payments: [],
      status: "Pending",
      paymentStatus: "Unpaid",
      deliveryAddress: body.deliveryAddress,
      deliveryDate: body.deliveryDate,
      notes: body.notes,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update customer stats
    await CustomerModel.findByIdAndUpdate(body.customer, {
      $inc: {
        totalOrders: 1,
        totalSpent: totalAmount
      }
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('customer', 'businessName firstName lastName phone email address')
      .populate('items.inventory', 'marbleType size quantity');

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
} 