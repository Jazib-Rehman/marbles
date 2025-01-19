"use client";
import React, { useState, useEffect } from "react";
import { MdSearch, MdFilterList, MdCalendarToday, MdAdd } from "react-icons/md";
import { orderApi } from "@/services/api/order";
import { IOrder } from "@/models/Order";
import { getErrorMessage } from "@/utils/apiUtils";
import AddPaymentModal from "./AddPaymentModal";
import OrderDetailsModal from "./OrderDetailsModal";

export default function PaymentsPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"" | "Unpaid" | "Partially Paid" | "Paid">("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [viewOrder, setViewOrder] = useState<IOrder | null>(null);

  // Calculate payment summaries
  const summary = orders.reduce(
    (acc, order) => {
      acc.totalAmount += order.totalAmount;
      acc.paidAmount += order.paidAmount;
      acc.remainingAmount += order.remainingAmount;
      return acc;
    },
    { totalAmount: 0, paidAmount: 0, remainingAmount: 0 }
  );

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderApi.getAll({
        search: searchQuery,
        paymentStatus: paymentStatus || undefined,
      });
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, paymentStatus]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Payments Overview</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Total Amount</div>
            <div className="text-2xl font-bold">₨ {summary.totalAmount.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Received Amount</div>
            <div className="text-2xl font-bold text-green-600">₨ {summary.paidAmount.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Pending Amount</div>
            <div className="text-2xl font-bold text-red-600">₨ {summary.remainingAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg w-full md:w-96">
            <MdSearch className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number or customer..."
              className="bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border rounded-lg"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
            >
              <option value="">All Payment Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                className="px-4 py-2 border rounded-lg"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
              <input
                type="date"
                className="px-4 py-2 border rounded-lg"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Order Details</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-right p-3">Total Amount</th>
                <th className="text-right p-3">Paid Amount</th>
                <th className="text-right p-3">Remaining</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Last Payment</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                orders.map((order,i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="p-3">
                      <div 
                        className="font-medium cursor-pointer hover:text-[#FF914D]"
                        onClick={() => setViewOrder(order)}
                      >
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerContact}</div>
                    </td>
                    <td className="p-3 text-right">₨ {order.totalAmount.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600">
                      ₨ {order.paidAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      ₨ {order.remainingAmount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-50 text-green-600"
                            : order.paymentStatus === "Partially Paid"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-green-500 hover:text-green-600 font-medium text-sm"
                        >
                          <MdAdd className="inline" size={16} /> Add Payment
                        </button>
                      )}
                      {order.payments.length > 0 ? (
                        <div>
                          <div className="font-medium">
                            ₨ {order.payments[order.payments.length - 1].amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(
                              order.payments[order.payments.length - 1].paymentDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No payments</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <AddPaymentModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={() => {
            fetchOrders();
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}

      {viewOrder && (
        <OrderDetailsModal
          isOpen={!!viewOrder}
          onClose={() => setViewOrder(null)}
          order={viewOrder}
        />
      )}
    </div>
  );
} 