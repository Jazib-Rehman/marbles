"use client";
import { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdPayment, MdVisibility } from 'react-icons/md';
import { ISupplyOrder } from '@/models/SupplyOrder';
import { supplyOrderApi } from '@/services/api/supplyOrder';
import CreateSupplyOrderModal from './CreateSupplyOrderModal';
import ViewSupplyOrderModal from './ViewSupplyOrderModal';
import DeleteSupplyOrderModal from './DeleteSupplyOrderModal';
import AddFactoryPaymentModal from './AddFactoryPaymentModal';
import AddCustomerPaymentModal from './AddCustomerPaymentModal';

export default function SupplyOrdersPage() {
  const [orders, setOrders] = useState<ISupplyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ISupplyOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomerPaymentModalOpen, setIsCustomerPaymentModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await supplyOrderApi.getAll(searchQuery);
      setOrders(data);
    } catch (err) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-500';
      case 'Delivered': return 'text-blue-500';
      case 'Dispatched': return 'text-purple-500';
      case 'Processing': return 'text-orange-500';
      case 'Pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supply Orders</h1>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#FF914D] text-white px-4 py-2 rounded-lg hover:bg-[#b16f46]"
        >
          <MdAdd size={20} />
          <span>Create Order</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex items-center gap-2">
          <MdSearch size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search orders..."
            className="flex-1 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Factory</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Total Amount</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Profit</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsViewModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {order.orderNumber}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.customer.businessName || `${order.customer.firstName} ${order.customer.lastName}`}
                </td>
                <td className="px-6 py-4 text-sm">{order.factoryName}</td>
                <td className="px-6 py-4 text-sm text-right">₨ {order.totalSaleAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-right">₨ {order.profit.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`flex justify-center ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsPaymentModalOpen(true);
                    }}
                    className="text-green-500 hover:text-green-700"
                    title="Factory Payment"
                  >
                    <MdPayment size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsCustomerPaymentModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Customer Payment"
                  >
                    <MdPayment size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreateSupplyOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchOrders();
          setIsCreateModalOpen(false);
        }}
      />

      {selectedOrder && (
        <>
          <ViewSupplyOrderModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedOrder(null);
            }}
            onOrderUpdate={fetchOrders}
            order={selectedOrder}
          />

          <DeleteSupplyOrderModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedOrder(null);
            }}
            onSuccess={() => {
              fetchOrders();
              setIsDeleteModalOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />

          <AddFactoryPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => {
              setIsPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            onSuccess={() => {
              fetchOrders();
              setIsPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />

          <AddCustomerPaymentModal
            isOpen={isCustomerPaymentModalOpen}
            onClose={() => {
              setIsCustomerPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            onSuccess={() => {
              fetchOrders();
              setIsCustomerPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
} 