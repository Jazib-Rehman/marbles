import mongoose from "mongoose";

// Schema for individual items in the order
const orderItemSchema = new mongoose.Schema({
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  marbleType: String,  // Cached from inventory for historical record
  size: String,        // Cached from inventory
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  ratePerFoot: {      // Rate at time of order
    type: Number,
    required: true,
    min: 0,
  },
  totalAmount: {       // quantity * ratePerFoot
    type: Number,
    required: true,
    min: 0,
  },
});

// Schema for payment records
const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Bank Transfer", "Check"],
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  reference: String,  // For check number or bank transfer reference
  notes: String,
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  customerType: {
    type: String,
    enum: ["B2B", "B2C"],
    required: true,
  },
  // Cache some customer details for historical record
  customerName: String,  // Business name or individual's name
  customerContact: String,
  
  items: [orderItemSchema],
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  remainingAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  payments: [paymentSchema],
  
  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Cancelled"],
    default: "Pending",
  },
  
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Partially Paid", "Paid"],
    default: "Unpaid",
  },

  deliveryAddress: {
    type: String,
    required: true,
  },
  
  deliveryDate: Date,
  
  notes: String,
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware to update timestamps
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to calculate totals and update payment status
orderSchema.pre('save', function(next) {
  // Calculate total amount from items
  this.totalAmount = this.items.reduce((sum, item) => sum + item.totalAmount, 0);
  
  // Calculate paid amount from payments
  this.paidAmount = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate remaining amount
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  // Update payment status
  if (this.paidAmount === 0) {
    this.paymentStatus = "Unpaid";
  } else if (this.paidAmount < this.totalAmount) {
    this.paymentStatus = "Partially Paid";
  } else {
    this.paymentStatus = "Paid";
  }
  
  next();
});

// Add this utility function at the top
function generateOrderNumber(): string {
  const prefix = 'ON-';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomPart}`;
}

// Update the pre-validate middleware to only handle totalAmount
orderSchema.pre('validate', async function(next) {
  // Calculate total amount if not set
  if (!this.totalAmount) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.totalAmount, 0);
  }
  next();
});

// TypeScript interfaces
export interface IOrderItem {
  inventory: string;
  marbleType: string;
  size: string;
  quantity: number;
  ratePerFoot: number;
  totalAmount: number;
}

export interface IPayment {
  amount: number;
  paymentMethod: "Cash" | "Bank Transfer" | "Check";
  paymentDate: Date;
  reference?: string;
  notes?: string;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  customer: string;
  customerType: "B2B" | "B2C";
  customerName: string;
  customerContact: string;
  items: IOrderItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  payments: IPayment[];
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  paymentStatus: "Unpaid" | "Partially Paid" | "Paid";
  deliveryAddress: string;
  deliveryDate?: Date;
  notes?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order; 