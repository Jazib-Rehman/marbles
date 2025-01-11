"use client";
import React, { useState } from "react";
import { MdClose, MdWarning } from "react-icons/md";
import { orderApi } from "@/services/api/order";
import { IOrder } from "@/models/Order";
import { getErrorMessage } from "@/utils/apiUtils";

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: IOrder;
}

export default function DeleteOrderModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: DeleteOrderModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOrderNumber, setConfirmOrderNumber] = useState("");

  const handleDelete = async () => {
    if (confirmOrderNumber !== order.orderNumber) {
      setError("Order number doesn't match");
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await orderApi.delete(order._id!);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <MdWarning size={24} />
            Delete Order
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
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

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete order <span className="font-semibold">{order.orderNumber}</span>?
            This action cannot be undone.
          </p>
          <p className="text-gray-600 mb-4">
            To confirm, please type the order number below:
          </p>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={confirmOrderNumber}
            onChange={(e) => setConfirmOrderNumber(e.target.value)}
            placeholder={order.orderNumber}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmOrderNumber !== order.orderNumber}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 