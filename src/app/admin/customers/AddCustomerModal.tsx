"use client";
import React, { useState } from "react";
import { MdClose, MdBusiness, MdPerson } from "react-icons/md";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: "B2B" | "B2C";
}

const businessTypes = [
  "Construction Company",
  "Real Estate Developer",
  "Interior Designer",
  "Contractor",
  "Retailer",
  "Other",
];

const cities = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  // Add more cities as needed
];

export default function AddCustomerModal({ isOpen, onClose, onSuccess, initialType = "B2B" }: AddCustomerModalProps) {
  const [customerType, setCustomerType] = useState<"B2B" | "B2C">(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // B2B Form Data
  const [b2bFormData, setB2bFormData] = useState({
    businessName: "",
    contactPerson: "",
    businessType: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  // B2C Form Data
  const [b2cFormData, setB2cFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    idCard: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = customerType === "B2B" 
        ? {
            ...b2bFormData,
            customerType: "B2B",
          }
        : {
            ...b2cFormData,
            customerType: "B2C",
          };

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add customer");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Customer</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Customer Type Selector */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setCustomerType("B2B")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              customerType === "B2B"
                ? "bg-[#FF914D] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MdBusiness size={20} />
            Business Customer
          </button>
          <button
            type="button"
            onClick={() => setCustomerType("B2C")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              customerType === "B2C"
                ? "bg-[#FF914D] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MdPerson size={20} />
            Individual Customer
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {customerType === "B2B" ? (
              // B2B Form Fields
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={b2bFormData.businessName}
                    onChange={(e) =>
                      setB2bFormData({ ...b2bFormData, businessName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={b2bFormData.contactPerson}
                    onChange={(e) =>
                      setB2bFormData({ ...b2bFormData, contactPerson: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={b2bFormData.businessType}
                    onChange={(e) =>
                      setB2bFormData({ ...b2bFormData, businessType: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Business Type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              // B2C Form Fields
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={b2cFormData.firstName}
                    onChange={(e) =>
                      setB2cFormData({ ...b2cFormData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={b2cFormData.lastName}
                    onChange={(e) =>
                      setB2cFormData({ ...b2cFormData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={b2cFormData.idCard}
                    onChange={(e) =>
                      setB2cFormData({ ...b2cFormData, idCard: e.target.value })
                    }
                    placeholder="00000-0000000-0"
                  />
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-lg"
                value={customerType === "B2B" ? b2bFormData.phone : b2cFormData.phone}
                onChange={(e) =>
                  customerType === "B2B"
                    ? setB2bFormData({ ...b2bFormData, phone: e.target.value })
                    : setB2cFormData({ ...b2cFormData, phone: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                value={customerType === "B2B" ? b2bFormData.email : b2cFormData.email}
                onChange={(e) =>
                  customerType === "B2B"
                    ? setB2bFormData({ ...b2bFormData, email: e.target.value })
                    : setB2cFormData({ ...b2cFormData, email: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={customerType === "B2B" ? b2bFormData.address : b2cFormData.address}
                onChange={(e) =>
                  customerType === "B2B"
                    ? setB2bFormData({ ...b2bFormData, address: e.target.value })
                    : setB2cFormData({ ...b2cFormData, address: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={customerType === "B2B" ? b2bFormData.city : b2cFormData.city}
                onChange={(e) =>
                  customerType === "B2B"
                    ? setB2bFormData({ ...b2bFormData, city: e.target.value })
                    : setB2cFormData({ ...b2cFormData, city: e.target.value })
                }
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
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
                'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 