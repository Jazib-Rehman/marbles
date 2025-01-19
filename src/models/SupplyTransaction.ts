import mongoose from "mongoose";

const supplyTransactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['INCOMING', 'OUTGOING'],
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  // For incoming: the factory/supplier we're getting from
  // For outgoing: the business we're supplying to
  businessParty: {
    name: {
      type: String,
      required: true,
    },
    contactPerson: String,
    phone: String,
    address: String,
  },
  items: [{
    marbleType: {
      type: String,
      required: true,
    },
    size: String,
    quantity: {
      type: Number,
      required: true,
    },
    ratePerFoot: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    required: true,
  },
  payments: [{
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Check'],
    },
    paymentDate: Date,
    reference: String,
    notes: String,
  }],
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid'],
    default: 'Unpaid',
  },
  deliveryDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export interface ISupplyTransaction {
  _id?: string;
  transactionType: 'INCOMING' | 'OUTGOING';
  orderNumber: string;
  businessParty: {
    name: string;
    contactPerson?: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    marbleType: string;
    size?: string;
    quantity: number;
    ratePerFoot: number;
    totalAmount: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  payments: Array<{
    amount: number;
    paymentMethod: 'Cash' | 'Bank Transfer' | 'Check';
    paymentDate: Date;
    reference?: string;
    notes?: string;
  }>;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  deliveryDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SupplyTransaction = mongoose.models.SupplyTransaction || mongoose.model('SupplyTransaction', supplyTransactionSchema);
export default SupplyTransaction; 