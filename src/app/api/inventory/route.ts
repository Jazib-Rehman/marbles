import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Inventory from "@/models/Inventory";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await Inventory.findById(id);
      if (!item) {
        return NextResponse.json(
          { error: "Inventory item not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(item);
    }

    // List inventory (existing code)
    const search = searchParams.get("search");
    let query = {};
    if (search) {
      query = {
        $or: [
          { marbleType: { $regex: search, $options: "i" } },
          { size: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    const inventory = await Inventory.find(query).sort({ createdAt: -1 });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching inventory" },
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
    
    // Calculate status based on quantity
    const status = body.quantity <= 0 ? "Out of Stock"
      : body.quantity <= 100 ? "Low Stock"
      : "In Stock";

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { 
        ...body,
        status
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating inventory item" },
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

    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting inventory item" },
      { status: 500 }
    );
  }
}

// POST new inventory item
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "marbleType",
      "size",
      "quantity",
      "purchaseRate",
      "saleRate"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set status based on quantity
    const status = body.quantity <= 0 ? "Out of Stock"
      : body.quantity <= 100 ? "Low Stock"
      : "In Stock";

    const newItem = await Inventory.create({
      ...body,
      status
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: "Error creating inventory item" },
      { status: 500 }
    );
  }
} 