import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import Inventory from "@/models/Inventory";

// GET all inventory items
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
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
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Error fetching inventory" },
      { status: 500 }
    );
  }
}

// POST new inventory item
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate required fields
    const requiredFields = ["marbleType", "size", "quantity", "purchaseRate", "saleRate"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate rates
    if (Number(body.purchaseRate) <= 0 || Number(body.saleRate) <= 0) {
      return NextResponse.json(
        { error: "Rates must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate sale rate is not less than purchase rate
    if (Number(body.saleRate) < Number(body.purchaseRate)) {
      return NextResponse.json(
        { error: "Sale rate cannot be less than purchase rate" },
        { status: 400 }
      );
    }

    // Set status based on quantity
    if (body.quantity <= 0) {
      body.status = "Out of Stock";
    } else if (body.quantity <= 100) { // You can adjust this threshold
      body.status = "Low Stock";
    }

    // Create new inventory item
    const newItem = await Inventory.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: "Error creating inventory item" },
      { status: 500 }
    );
  }
} 