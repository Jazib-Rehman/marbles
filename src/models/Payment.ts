import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Check'],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  reference: String,
  notes: String,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface IPayment {
  _id?: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Check';
  paymentDate: Date;
  reference?: string;
  notes?: string;
  order: string;
  createdAt?: Date;
}

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment; 