"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { ISupplyOrder } from "@/models/SupplyOrder";
import { supplyOrderApi } from "@/services/api/supplyOrder";
import { getErrorMessage } from "@/utils/apiUtils";

interface ViewSupplyOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ISupplyOrder;
  onOrderUpdate: () => void;
}

export default function ViewSupplyOrderModal({
  isOpen,
  onClose,
  order,
  onOrderUpdate,
}: ViewSupplyOrderModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Completed') => {
    try {
      setIsUpdating(true);
      setError(null);
      await supplyOrderApi.updateStatus(order._id!, newStatus);
      onOrderUpdate();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Order Number</h3>
            <p>{order.orderNumber}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Factory Name</h3>
            <p>{order.factoryName}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Customer</h3>
            <p>{order.customer.businessName || `${order.customer.firstName} ${order.customer.lastName}`}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Status</h3>
            <p>{order.status}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Delivery Address</h3>
            <p>{order.deliveryAddress}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Delivery Date</h3>
            <p>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not set'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-500 mb-2">Order Status</h3>
          <div className="flex items-center gap-4">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              disabled={isUpdating}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
            {isUpdating && <span className="text-gray-500">Updating...</span>}
            {error && <span className="text-red-500">{error}</span>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-500 mb-2">Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Marble Type</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Purchase Rate</th>
                  <th className="px-4 py-2 text-right">Sale Rate</th>
                  <th className="px-4 py-2 text-right">Purchase Total</th>
                  <th className="px-4 py-2 text-right">Sale Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.marbleType}</td>
                    <td className="px-4 py-2">{item.size}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">₨ {item.purchaseRate.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₨ {item.saleRate.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₨ {item.totalPurchaseAmount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₨ {item.totalSaleAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-500 mb-2">Factory Payments</h3>
            <div className="space-y-2">
              {order.factoryPayments.length === 0 ? (
                <p className="text-gray-500 italic">No payments made yet</p>
              ) : (
                order.factoryPayments.map((payment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Amount:</span>
                    <span>₨ {payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Method:</span>
                    <span>{payment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                  </div>
                    {payment.reference && (
                      <div className="flex justify-between mt-1">
                        <span className="text-sm font-medium">Reference:</span>
                        <span>{payment.reference}</span>
                      </div>
                    )}
                </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-500 mb-2">Customer Payments</h3>
            <div className="space-y-2">
              {order.customerPayments.length === 0 ? (
                <p className="text-gray-500 italic">No payments received yet</p>
              ) : (
                order.customerPayments.map((payment: any, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Amount:</span>
                      <span>₨ {payment.amount ? payment.amount.toLocaleString() : '0'}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Method:</span>
                      <span>{payment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                    </div>
                    {payment.reference && (
                      <div className="flex justify-between mt-1">
                        <span className="text-sm font-medium">Reference:</span>
                        <span>{payment.reference}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-500 mb-2">Payment Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Factory Payments</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                <span className="font-medium">₨ {order.totalPurchaseAmount.toLocaleString()}</span>
              </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="font-medium text-green-600">₨ {order.paidToFactory.toLocaleString()}</span>
              </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Remaining:</span>
                  <span className="font-medium text-red-600">
                    ₨ {(order.totalPurchaseAmount - order.paidToFactory).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{order.factoryPaymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Customer Payments</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">₨ {order.totalSaleAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Received Amount:</span>
                  <span className="font-medium text-green-600">₨ {order.receivedFromCustomer.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Remaining:</span>
                  <span className="font-medium text-red-600">
                    ₨ {(order.totalSaleAmount - order.receivedFromCustomer).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{order.customerPaymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 