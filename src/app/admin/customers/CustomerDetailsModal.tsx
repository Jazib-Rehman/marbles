"use client";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";
import { IOrder } from "@/models/Order";
import { orderApi } from "@/services/api/order";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: IB2BCustomer | IB2CCustomer;
}

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
}: CustomerDetailsModalProps) {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerOrders = await orderApi.getAll({ customerId: customer._id });
        setOrders(customerOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchOrders();
    }
  }, [customer._id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {customer.customerType === "B2B" 
              ? (customer as IB2BCustomer).businessName 
              : `${(customer as IB2CCustomer).firstName} ${(customer as IB2CCustomer).lastName}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Customer Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div>{customer.phone}</div>
            </div>
            {customer.email && (
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>{customer.email}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div>{customer.address}</div>
            </div>
            {customer.customerType === "B2B" && (
              <>
                <div>
                  <div className="text-sm text-gray-500">Contact Person</div>
                  <div>{(customer as IB2BCustomer).contactPerson}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Business Type</div>
                  <div>{(customer as IB2BCustomer).businessType}</div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Account Summary</h3>
            <div>
              <div className="text-sm text-gray-500">Total Orders</div>
              <div>{customer.totalOrders}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Spent</div>
              <div>₨ {customer.totalSpent.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  customer.status === "Active"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {customer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Order History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Items</th>
                  <th className="text-right p-3">Total Amount</th>
                  <th className="text-right p-3">Paid Amount</th>
                  <th className="text-right p-3">Remaining</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center p-4">Loading...</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100">
                      <td className="p-3">{order.orderNumber}</td>
                      <td className="p-3">
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {order.items.map(item => `${item.marbleType} (${item.quantity})`).join(", ")}
                      </td>
                      <td className="p-3 text-right">
                        ₨ {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-green-600">
                        ₨ {order.paidAmount.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-red-600">
                        ₨ {order.remainingAmount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 