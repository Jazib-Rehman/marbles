"use client";
import React from "react";
import { MdClose } from "react-icons/md";
import { IOrder } from "@/models/Order";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Information</h3>
            <div>
              <div className="text-sm text-gray-500">Order Number</div>
              <div className="font-medium">{order.orderNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div>{new Date(order.createdAt!).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  order.status === "Completed"
                    ? "bg-green-50 text-green-600"
                    : order.status === "Pending"
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium">{order.customerName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Contact</div>
              <div>{order.customerContact}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Delivery Address</div>
              <div>{order.deliveryAddress}</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Order Items</h3>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Item</th>
                <th className="text-right p-3">Quantity</th>
                <th className="text-right p-3">Rate</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="p-3">
                    {item.marbleType} - {item.size}
                  </td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">₨ {item.ratePerFoot.toLocaleString()}</td>
                  <td className="p-3 text-right">₨ {item.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-200 font-medium">
                <td colSpan={3} className="p-3 text-right">Total Amount:</td>
                <td className="p-3 text-right">₨ {order.totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Payment History</h3>
          <div className="space-y-4">
            {order.payments.map((payment, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">₨ {payment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Method</div>
                  <div>{payment.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div>{new Date(payment.paymentDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Reference</div>
                  <div>{payment.reference || "-"}</div>
                </div>
                {payment.notes && (
                  <div className="col-span-2 md:col-span-4">
                    <div className="text-sm text-gray-500">Notes</div>
                    <div>{payment.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 