"use client";
import React, { useState, useEffect } from "react";
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete } from "react-icons/md";
import { orderApi } from "@/services/api/order";
import { IOrder } from "@/models/Order";
import { getErrorMessage } from "@/utils/apiUtils";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IOrder['status'] | "">("");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<IOrder | null>(null);

  const fetchOrders = async (search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderApi.getAll({ 
        search,
        status: statusFilter || undefined 
      });
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(searchQuery);
  }, [searchQuery, statusFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF914D] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MdAdd size={20} />
          New Order
        </button>
      </div>

      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchOrders(searchQuery);
          setIsModalOpen(false);
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg w-full md:w-96">
            <MdSearch className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg ml-4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IOrder['status'] | "")}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Total Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Actions</th>
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
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="p-3">
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerContact}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {order.items.map((item) => (
                          <div key={item.inventory}>
                            {item.marbleType} - {item.size} ({item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">₨{order.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Completed"
                            ? "bg-green-50 text-green-600"
                            : order.status === "Processing"
                            ? "bg-blue-50 text-blue-600"
                            : order.status === "Cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
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
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Edit"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <MdEdit size={20} />
                        </button>
                        {order.status === "Pending" && (
                          <button
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Delete"
                            onClick={() => setOrderToDelete(order)}
                          >
                            <MdDelete size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <EditOrderModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={() => {
            fetchOrders(searchQuery);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}

      {orderToDelete && (
        <DeleteOrderModal
          isOpen={!!orderToDelete}
          onClose={() => setOrderToDelete(null)}
          onSuccess={() => {
            fetchOrders(searchQuery);
            setOrderToDelete(null);
          }}
          order={orderToDelete}
        />
      )}
    </div>
  );
} 