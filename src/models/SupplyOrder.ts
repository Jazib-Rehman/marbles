import mongoose from "mongoose";

const supplyOrderSchema = new mongoose.Schema({
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
  factoryName: {
    type: String,
    required: true,
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
    purchaseRate: {
      type: Number,
      required: true,
    },
    saleRate: {
      type: Number,
      required: true,
    },
    totalPurchaseAmount: {
      type: Number,
      required: true,
    },
    totalSaleAmount: {
      type: Number,
      required: true,
    }
  }],
  totalPurchaseAmount: {
    type: Number,
    required: true,
  },
  totalSaleAmount: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  paidToFactory: {
    type: Number,
    default: 0,
  },
  receivedFromCustomer: {
    type: Number,
    default: 0,
  },
  factoryPayments: [{
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Check'],
    },
    paymentDate: Date,
    reference: String,
    notes: String,
  }],
  customerPayments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Completed'],
    default: 'Pending',
  },
  factoryPaymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid'],
    default: 'Unpaid',
  },
  customerPaymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid'],
    default: 'Unpaid',
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export interface ISupplyOrder {
  _id?: string;
  orderNumber: string;
  customer: {
    _id: string;
    businessName?: string;
    firstName?: string;
    lastName?: string;
  };
  factoryName: string;
  items: Array<{
    marbleType: string;
    size?: string;
    quantity: number;
    purchaseRate: number;
    saleRate: number;
    totalPurchaseAmount: number;
    totalSaleAmount: number;
  }>;
  totalPurchaseAmount: number;
  totalSaleAmount: number;
  profit: number;
  paidToFactory: number;
  receivedFromCustomer: number;
  factoryPayments: Array<{
    amount: number;
    paymentMethod: 'Cash' | 'Bank Transfer' | 'Check';
    paymentDate: Date;
    reference?: string;
    notes?: string;
  }>;
  customerPayments: string[];  // Payment IDs
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Completed';
  factoryPaymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  customerPaymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  deliveryAddress: string;
  deliveryDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

let SupplyOrder: mongoose.Model<ISupplyOrder>;
try {
  SupplyOrder = mongoose.model<ISupplyOrder>('SupplyOrder');
} catch {
  SupplyOrder = mongoose.model<ISupplyOrder>('SupplyOrder', supplyOrderSchema);
}

export default SupplyOrder; 