import mongoose from "mongoose";

// Base schema with common fields
const customerSchema = new mongoose.Schema({
  customerType: {
    type: String,
    enum: ["B2B", "B2C"],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { discriminatorKey: 'customerType' });

// B2B specific schema
const b2bSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  currentArrears: {
    type: Number,
    default: 0,
  },
  arrearsHistory: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    amount: Number,
    dueDate: Date,
    status: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid"],
      default: "Pending"
    },
    payments: [{
      amount: Number,
      date: Date,
      paymentMethod: String,
      reference: String,
    }]
  }]
});

// B2C specific schema
const b2cSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  idCard: {  // CNIC
    type: String,
  },
  preferences: {
    type: [String],  // Store customer preferences like preferred marble types
    default: [],
  }
});

// Update timestamps middleware
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if the model exists before creating
const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

// Create discriminator models only if they don't exist
const B2BCustomer = CustomerModel.discriminators?.B2B || CustomerModel.discriminator('B2B', b2bSchema);
const B2CCustomer = CustomerModel.discriminators?.B2C || CustomerModel.discriminator('B2C', b2cSchema);

export { CustomerModel, B2BCustomer, B2CCustomer };

// TypeScript interfaces
export interface ICustomerBase {
  _id?: string;
  customerType: "B2B" | "B2C";
  phone: string;
  email?: string;
  address: string;
  city: string;
  status: "Active" | "Inactive";
  totalOrders: number;
  totalSpent: number;
}

export interface IB2BCustomer extends ICustomerBase {
  customerType: "B2B";
  businessName: string;
  contactPerson: string;
  businessType: string;
  currentArrears: number;
  arrearsHistory: Array<{
    orderId: string;
    amount: number;
    dueDate: Date;
    status: "Pending" | "Partially Paid" | "Paid";
    payments: Array<{
      amount: number;
      date: Date;
      paymentMethod: string;
      reference: string;
    }>;
  }>;
}

export interface IB2CCustomer extends ICustomerBase {
  customerType: "B2C";
  firstName: string;
  lastName: string;
  idCard?: string;
  preferences: string[];
}

export type CustomerDocument = mongoose.Document & (IB2BCustomer | IB2CCustomer); 