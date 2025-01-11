"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { inventoryApi, InventoryItem } from "@/services/api/inventory";
import { getErrorMessage } from "@/utils/apiUtils";

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const marbleTypes = [
  "Sunny Gray",
  "Badal Gray",
  "Sunny White",
  "Ziarat White",
  "Afghan White",
  "Black",
  "Botticino",
];

const marbleSizes = [
  "12x6",
  "12x4",
  "6x6",
  "8x4",
  "24x12",
];

export default function AddInventoryModal({ isOpen, onClose, onSuccess }: AddInventoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    marbleType: "",
    size: "",
    quantity: "",
    purchaseRate: "",
    saleRate: "",
    location: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await inventoryApi.create({
        ...formData,
        quantity: Number(formData.quantity),
        purchaseRate: Number(formData.purchaseRate),
        saleRate: Number(formData.saleRate),
      });
      
      setFormData({
        marbleType: "",
        size: "",
        quantity: "",
        purchaseRate: "",
        saleRate: "",
        location: "",
        notes: "",
      });
      
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
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Inventory Item</h2>
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
                Marble Type
              </label>
              <select 
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.marbleType}
                onChange={(e) => setFormData({...formData, marbleType: e.target.value})}
                required
              >
                <option value="">Select Marble Type</option>
                {marbleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (inches)
              </label>
              <select 
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                required
              >
                <option value="">Select Size</option>
                {marbleSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (feet)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="Enter quantity in feet"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Rate (₨/ft)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.purchaseRate}
                onChange={(e) => setFormData({...formData, purchaseRate: e.target.value})}
                placeholder="Enter purchase rate"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Rate (₨/ft)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.saleRate}
                onChange={(e) => setFormData({...formData, saleRate: e.target.value})}
                placeholder="Enter sale rate"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Warehouse A, Section 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes"
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
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF914D] text-white px-6 py-2 rounded-lg hover:bg-[#b16f46] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 