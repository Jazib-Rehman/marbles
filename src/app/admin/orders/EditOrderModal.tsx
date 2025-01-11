"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { orderApi } from "@/services/api/order";
import { IOrder, IPayment } from "@/models/Order";
import { getErrorMessage } from "@/utils/apiUtils";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: IOrder;
}

export default function EditOrderModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: EditOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(order.status);
  const [payment, setPayment] = useState({
    amount: 0,
    paymentMethod: "Cash" as IPayment["paymentMethod"],
    paymentDate: new Date().toISOString().split('T')[0],
    reference: "",
    notes: "",
  });

  const handleStatusUpdate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await orderApi.update(order._id!, { status });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentAdd = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await orderApi.addPayment(order._id!, {
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
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Process Order: {order.orderNumber}</h2>
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

        <div className="space-y-6">
          {/* Status Update Section */}
          <div className="border-b pb-6">
            <h3 className="font-medium mb-3">Update Status</h3>
            <div className="flex gap-4">
              <select
                className="px-3 py-2 border rounded-lg flex-1"
                value={status}
                onChange={(e) => setStatus(e.target.value as IOrder["status"])}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={isSubmitting || status === order.status}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* Add Payment Section */}
          <div>
            <h3 className="font-medium mb-3">Add Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Amount</label>
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
                      paymentMethod: e.target.value as "Cash" | "Bank Transfer" | "Check",
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
                  value={payment.paymentDate}
                  onChange={(e) =>
                    setPayment({ ...payment, paymentDate: e.target.value })
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
              <div className="col-span-2">
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
            <button
              onClick={handlePaymentAdd}
              disabled={isSubmitting || payment.amount <= 0}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Add Payment
            </button>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="font-medium mb-3">Payment History</h3>
            <div className="space-y-2">
              {order.payments.map((p, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg text-sm grid grid-cols-2 gap-2"
                >
                  <div>
                    <span className="font-medium">Amount:</span> ₨
                    {p.amount.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Method:</span> {p.paymentMethod}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Reference:</span> {p.reference}
                  </div>
                  {p.notes && (
                    <div className="col-span-2">
                      <span className="font-medium">Notes:</span> {p.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 