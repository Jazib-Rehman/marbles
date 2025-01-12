import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "../../../../../lib/mongoose";
import Inventory from "@/models/Inventory";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const item = await Inventory.findById(params.id);
        if (!item) {
            return NextResponse.json(
                { error: "Inventory item not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching inventory item" },
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

        const updatedItem = await Inventory.findByIdAndUpdate(
            params.id,
            { ...body },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const deletedItem = await Inventory.findByIdAndDelete(params.id);

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