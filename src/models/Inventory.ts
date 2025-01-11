import mongoose from "mongoose";

export interface IInventory {
  _id?: string;
  marbleType: string;
  size: string;
  quantity: number;
  saleRate: number;
  purchaseRate: number;
  supplier: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventorySchema = new mongoose.Schema({
  marbleType: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  saleRate: { type: Number, required: true },
  purchaseRate: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

export default Inventory; 