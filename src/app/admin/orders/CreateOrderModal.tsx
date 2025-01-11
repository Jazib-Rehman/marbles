"use client";
import React, { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete } from "react-icons/md";
import { orderApi } from "@/services/api/order";
import { customerApi } from "@/services/api/customer";
import { inventoryApi } from "@/services/api/inventory";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";
import { IInventory } from "@/models/Inventory";
import { getErrorMessage } from "@/utils/apiUtils";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  inventory: string;
  quantity: number;
  ratePerFoot: number;
  marbleType?: string;
  size?: string;
  availableQuantity?: number;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<(IB2BCustomer | IB2CCustomer)[]>([]);
  const [inventory, setInventory] = useState<IInventory[]>([]);

  const [formData, setFormData] = useState({
    customer: "",
    items: [] as OrderItem[],
    deliveryAddress: "",
    deliveryDate: "",
    notes: "",
  });

  // Fetch customers and inventory on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, inventoryData] = await Promise.all([
          customerApi.getAll(),
          inventoryApi.getAll(),
        ]);
        setCustomers(customersData);
        setInventory(inventoryData as IInventory[]);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { inventory: "", quantity: 0, ratePerFoot: 0 },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...formData.items];
    if (field === "inventory") {
      const selectedInventory = inventory.find((item) => item._id === value);
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        marbleType: selectedInventory?.marbleType,
        size: selectedInventory?.size,
        ratePerFoot: selectedInventory?.saleRate || 0,
        availableQuantity: selectedInventory?.quantity,
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Get selected customer's address
      const customer = customers.find((c) => c._id === formData.customer);
      if (!customer) throw new Error("Please select a customer");

      // Validate items
      if (formData.items.length === 0) {
        throw new Error("Please add at least one item");
      }

      for (const item of formData.items) {
        if (item.quantity <= 0) {
          throw new Error("Quantity must be greater than 0");
        }
        if (item.quantity > (item.availableQuantity || 0)) {
          throw new Error(`Insufficient quantity for ${item.marbleType} (${item.size})`);
        }
      }

      await orderApi.create({
        ...formData,
        deliveryAddress: formData.deliveryAddress || customer.address,
        deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
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
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Order</h2>
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.customer}
                onChange={(e) =>
                  setFormData({ ...formData, customer: e.target.value })
                }
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerType === "B2B"
                      ? (customer as IB2BCustomer).businessName
                      : `${(customer as IB2CCustomer).firstName} ${
                          (customer as IB2CCustomer).lastName
                        }`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.deliveryAddress}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryAddress: e.target.value })
                }
                placeholder="Leave empty to use customer's address"
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Order Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[#FF914D] hover:text-[#b16f46] flex items-center gap-1"
              >
                <MdAdd size={20} />
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 mb-4 items-center"
              >
                <div className="col-span-4">
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={item.inventory}
                    onChange={(e) =>
                      handleItemChange(index, "inventory", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Product</option>
                    {inventory.map((inv) => (
                      <option key={inv._id} value={inv._id}>
                        {`${inv.marbleType} - ${inv.size} (${inv.quantity} available)`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Quantity"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                    required
                    min="1"
                    max={item.availableQuantity}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Rate"
                    value={item.ratePerFoot || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "ratePerFoot",
                        Number(e.target.value)
                      )
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="col-span-3">
                  <div className="text-sm text-gray-500">
                    Total: ₨{(item.quantity * item.ratePerFoot).toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-4">
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
              className="bg-[#FF914D] text-white px-6 py-2 rounded-lg hover:bg-[#b16f46] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 