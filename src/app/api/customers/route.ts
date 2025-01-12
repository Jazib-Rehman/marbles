import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import { CustomerModel, B2BCustomer, B2CCustomer } from "@/models/Customer";

// GET all customers with optional search and filter by type
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (id) {
      // Single customer fetch
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      return NextResponse.json(customer);
    }
    
    // List customers (existing code)
    const search = searchParams.get("search");
    const type = searchParams.get("type") as "B2B" | "B2C" | null;
    
    let query: any = {};

    // Add type filter if provided
    if (type) {
      query.customerType = type;
    }

    // Add search filter if provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      if (type === "B2B") {
        query.$or = [
          { businessName: searchRegex },
          { contactPerson: searchRegex },
          { phone: searchRegex },
          { email: searchRegex },
        ];
      } else if (type === "B2C") {
        query.$or = [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { phone: searchRegex },
          { email: searchRegex },
        ];
      } else {
        // If no type specified, search in all fields
        query.$or = [
          { businessName: searchRegex },
          { contactPerson: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
          { phone: searchRegex },
          { email: searchRegex },
        ];
      }
    }

    const customers = await CustomerModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500 }
    );
  }
}

// POST new customer
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate required fields based on customer type
    const requiredFields = body.customerType === "B2B" 
      ? ["businessName", "contactPerson", "businessType", "phone", "address", "city"] 
      : ["firstName", "lastName", "phone", "address", "city"];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create customer based on type
    const CustomerModel = body.customerType === "B2B" ? B2BCustomer : B2CCustomer;
    const newCustomer = await CustomerModel.create(body);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 }
    );
  }
}

// Update PUT to use search params
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const body = await request.json();
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    // ... rest of PUT logic
  } catch (error) {
    return NextResponse.json({ error: "Error updating customer" }, { status: 500 });
  }
}

// Update DELETE to use search params
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const deletedCustomer = await CustomerModel.findByIdAndDelete(id);
    // ... rest of DELETE logic
  } catch (error) {
    return NextResponse.json({ error: "Error deleting customer" }, { status: 500 });
  }
} 