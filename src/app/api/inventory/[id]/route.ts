import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "../../../../../lib/mongoose";
import Inventory from "@/models/Inventory";

type Props = {
  params: {
    id: string;
  };
};

// GET single inventory item
export async function GET(request: NextRequest, { params }: Props) {
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

// PUT update inventory item
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        await dbConnect();
        const body = await request.json();

        // Validate rates if they're being updated
        if (body.purchaseRate && body.purchaseRate <= 0) {
            return NextResponse.json(
                { error: "Purchase rate must be greater than 0" },
                { status: 400 }
            );
        }

        if (body.saleRate && body.saleRate <= 0) {
            return NextResponse.json(
                { error: "Sale rate must be greater than 0" },
                { status: 400 }
            );
        }

        if (body.purchaseRate && body.saleRate && body.saleRate < body.purchaseRate) {
            return NextResponse.json(
                { error: "Sale rate cannot be less than purchase rate" },
                { status: 400 }
            );
        }

        // Update status based on quantity if it's being updated
        if (body.quantity !== undefined) {
            if (body.quantity <= 0) {
                body.status = "Out of Stock";
            } else if (body.quantity <= 100) {
                body.status = "Low Stock";
            } else {
                body.status = "In Stock";
            }
        }

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

// DELETE inventory item
export async function DELETE(request: NextRequest, { params }: Props) {
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