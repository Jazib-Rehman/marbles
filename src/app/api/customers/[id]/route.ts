import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongoose";
import { CustomerModel } from "@/models/Customer";

// GET single customer
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const customer = await CustomerModel.findById(context.params.id);
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching customer" },
      { status: 500 }
    );
  }
}

// PUT update customer
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      context.params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const deletedCustomer = await CustomerModel.findByIdAndDelete(context.params.id);

    if (!deletedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 }
    );
  }
} 