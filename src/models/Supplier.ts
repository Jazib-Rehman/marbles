import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: String,
  address: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export interface ISupplier {
  _id?: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
export default Supplier; 