"use client";
import React from "react";
import { MdClose, MdWarning } from "react-icons/md";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  customer: IB2BCustomer | IB2CCustomer;
}

export default function DeleteCustomerModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  customer,
}: DeleteCustomerModalProps) {
  if (!isOpen) return null;

  const customerName = customer.customerType === "B2B" 
    ? (customer as IB2BCustomer).businessName
    : `${(customer as IB2CCustomer).firstName} ${(customer as IB2CCustomer).lastName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <MdWarning size={24} />
            Confirm Delete
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{customerName}</span>? 
            This action cannot be undone.
          </p>
          {customer.totalOrders > 0 && (
            <p className="mt-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
              Warning: This customer has {customer.totalOrders} order{customer.totalOrders > 1 ? 's' : ''} in the system.
            </p>
          )}
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
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 