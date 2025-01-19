"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { ISupplyOrder } from "@/models/SupplyOrder";
import { supplyOrderApi } from "@/services/api/supplyOrder";
import { getErrorMessage } from "@/utils/apiUtils";

interface AddFactoryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: ISupplyOrder;
}

export default function AddFactoryPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: AddFactoryPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState({
    amount: 0,
    paymentMethod: 'Cash' as const,
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });

  const remainingAmount = order.totalPurchaseAmount - order.paidToFactory;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payment.amount <= 0) {
      setError('Payment amount must be greater than 0');
      return;
    }
    if (payment.amount > remainingAmount) {
      setError('Payment amount cannot exceed remaining amount');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await supplyOrderApi.addFactoryPayment(order._id!, {
        ...payment,
        paymentDate: new Date(payment.paymentDate),
      });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Factory Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg mb-4">
          <p>Remaining Amount: ₨ {remainingAmount.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                required
                min="1"
                max={remainingAmount}
                value={payment.amount}
                onChange={(e) => setPayment(prev => ({ ...prev, amount: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                required
                value={payment.paymentMethod}
                onChange={(e) => setPayment(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                required
                value={payment.paymentDate}
                onChange={(e) => setPayment(prev => ({ ...prev, paymentDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference
              </label>
              <input
                type="text"
                value={payment.reference}
                onChange={(e) => setPayment(prev => ({ ...prev, reference: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={payment.notes}
                onChange={(e) => setPayment(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF914D] text-white px-6 py-2 rounded-lg hover:bg-[#b16f46] disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 