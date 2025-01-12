"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { orderApi } from "@/services/api/order";
import { IOrder, IPayment } from "@/models/Order";
import { getErrorMessage } from "@/utils/apiUtils";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: IOrder;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: AddPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState({
    amount: 0,
    paymentMethod: "Cash" as IPayment["paymentMethod"],
    date: new Date().toISOString().split('T')[0],
    notes: "",
    reference: "",
  });

  const handlePaymentAdd = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (order._id) {
        const response = await orderApi.addPayment(order._id, {
          ...payment,
          amount: Number(payment.amount)
        });

        if (response) {
          onSuccess();
          onClose();
        }
      }
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
          <h2 className="text-xl font-bold">Add Payment</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Amount (Remaining: ₨{order.remainingAmount.toLocaleString()})</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={payment.amount}
              onChange={(e) =>
                setPayment({ ...payment, amount: Number(e.target.value) })
              }
              min="0"
              max={order.remainingAmount}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Payment Method</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={payment.paymentMethod}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  paymentMethod: e.target.value as IPayment["paymentMethod"],
                })
              }
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Payment Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={payment.date}
              onChange={(e) =>
                setPayment({ ...payment, date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Reference</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={payment.reference}
              onChange={(e) =>
                setPayment({ ...payment, reference: e.target.value })
              }
              placeholder="Check/Transaction number"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              value={payment.notes}
              onChange={(e) =>
                setPayment({ ...payment, notes: e.target.value })
              }
              rows={2}
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
            type="button"
            onClick={handlePaymentAdd}
            disabled={isSubmitting || payment.amount <= 0}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Payment"}
          </button>
        </div>
      </div>
    </div>
  );
} 