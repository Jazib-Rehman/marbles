"use client";
import React, { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete } from "react-icons/md";
import { customerApi } from "@/services/api/customer";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";
import { getErrorMessage } from "@/utils/apiUtils";
import { supplyOrderApi } from "@/services/api/supplyOrder";

interface CreateSupplyOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  marbleType: string;
  size: string;
  quantity: number;
  purchaseRate: number;
  saleRate: number;
  totalPurchaseAmount: number;
  totalSaleAmount: number;
}

export default function CreateSupplyOrderModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSupplyOrderModalProps) {
  const [customers, setCustomers] = useState<(IB2BCustomer | IB2CCustomer)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer: "",
    factoryName: "",
    deliveryAddress: "",
    deliveryDate: "",
    notes: "",
    items: [] as OrderItem[],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerApi.getAll();
        setCustomers(response);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    fetchCustomers();
  }, []);

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        marbleType: "",
        size: "",
        quantity: 0,
        purchaseRate: 0,
        saleRate: 0,
        totalPurchaseAmount: 0,
        totalSaleAmount: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };

      // Calculate totals if quantity or rates change
      if (field === 'quantity' || field === 'purchaseRate' || field === 'saleRate') {
        const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
        const purchaseRate = field === 'purchaseRate' ? Number(value) : newItems[index].purchaseRate;
        const saleRate = field === 'saleRate' ? Number(value) : newItems[index].saleRate;

        newItems[index].totalPurchaseAmount = quantity * purchaseRate;
        newItems[index].totalSaleAmount = quantity * saleRate;
      }

      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const totalPurchaseAmount = formData.items.reduce((sum, item) => sum + item.totalPurchaseAmount, 0);
      const totalSaleAmount = formData.items.reduce((sum, item) => sum + item.totalSaleAmount, 0);
      const profit = totalSaleAmount - totalPurchaseAmount;

      const orderData = {
        ...formData,
        customer: { _id: formData.customer },
        deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
        totalPurchaseAmount,
        totalSaleAmount,
        profit,
        paidToFactory: 0,
        receivedFromCustomer: 0,
        factoryPayments: [],
        customerPayments: [],
        status: 'Pending' as const,
        factoryPaymentStatus: 'Unpaid' as const,
        customerPaymentStatus: 'Unpaid' as const
      };

      const response = await supplyOrderApi.create(orderData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create Supply Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                required
                value={formData.customer}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerType === "B2B" 
                      ? (customer as IB2BCustomer).businessName
                      : `${(customer as IB2CCustomer).firstName} ${(customer as IB2CCustomer).lastName}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Factory Name
              </label>
              <input
                type="text"
                required
                value={formData.factoryName}
                onChange={(e) => setFormData(prev => ({ ...prev, factoryName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Order Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-[#FF914D] hover:text-[#b16f46]"
              >
                <MdAdd size={20} />
                <span>Add Item</span>
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 mb-4 p-4 border rounded-lg">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marble Type
                  </label>
                  <input
                    type="text"
                    required
                    value={item.marbleType}
                    onChange={(e) => updateItem(index, 'marbleType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={item.size}
                    onChange={(e) => updateItem(index, 'size', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Rate
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={item.purchaseRate}
                    onChange={(e) => updateItem(index, 'purchaseRate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Rate
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={item.saleRate}
                    onChange={(e) => updateItem(index, 'saleRate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-6 flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="text-sm">
                    <span className="font-medium">Purchase Total:</span> ₨ {item.totalPurchaseAmount.toLocaleString()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Sale Total:</span> ₨ {item.totalSaleAmount.toLocaleString()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Profit:</span> ₨ {(item.totalSaleAmount - item.totalPurchaseAmount).toLocaleString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
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
              disabled={isSubmitting || formData.items.length === 0}
              className="bg-[#FF914D] text-white px-6 py-2 rounded-lg hover:bg-[#b16f46] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 