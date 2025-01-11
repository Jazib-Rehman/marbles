"use client";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { customerApi } from "@/services/api/customer";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";
import { getErrorMessage } from "@/utils/apiUtils";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: IB2BCustomer | IB2CCustomer;
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
];

export default function EditCustomerModal({ isOpen, onClose, onSuccess, customer }: EditCustomerModalProps) {
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
    status: "Active" as "Active" | "Inactive",
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
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (customer.customerType === "B2B") {
      const b2bCustomer = customer as IB2BCustomer;
      setB2bFormData({
        businessName: b2bCustomer.businessName,
        contactPerson: b2bCustomer.contactPerson,
        businessType: b2bCustomer.businessType,
        phone: b2bCustomer.phone,
        email: b2bCustomer.email || "",
        address: b2bCustomer.address,
        city: b2bCustomer.city,
        status: b2bCustomer.status,
      });
    } else {
      const b2cCustomer = customer as IB2CCustomer;
      setB2cFormData({
        firstName: b2cCustomer.firstName,
        lastName: b2cCustomer.lastName,
        phone: b2cCustomer.phone,
        email: b2cCustomer.email || "",
        address: b2cCustomer.address,
        city: b2cCustomer.city,
        idCard: b2cCustomer.idCard || "",
        status: b2cCustomer.status,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = customer.customerType === "B2B" 
        ? {
            ...b2bFormData,
            customerType: "B2B" as const,
          }
        : {
            ...b2cFormData,
            customerType: "B2C" as const,
          };

      await customerApi.update(customer._id!, formData);
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
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Edit {customer.customerType === "B2B" ? "Business" : "Individual"} Customer
          </h2>
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
            {customer.customerType === "B2B" ? (
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
                value={customer.customerType === "B2B" ? b2bFormData.phone : b2cFormData.phone}
                onChange={(e) =>
                  customer.customerType === "B2B"
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
                value={customer.customerType === "B2B" ? b2bFormData.email : b2cFormData.email}
                onChange={(e) =>
                  customer.customerType === "B2B"
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
                value={customer.customerType === "B2B" ? b2bFormData.address : b2cFormData.address}
                onChange={(e) =>
                  customer.customerType === "B2B"
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
                value={customer.customerType === "B2B" ? b2bFormData.city : b2cFormData.city}
                onChange={(e) =>
                  customer.customerType === "B2B"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={customer.customerType === "B2B" ? b2bFormData.status : b2cFormData.status}
                onChange={(e) =>
                  customer.customerType === "B2B"
                    ? setB2bFormData({ ...b2bFormData, status: e.target.value as "Active" | "Inactive" })
                    : setB2cFormData({ ...b2cFormData, status: e.target.value as "Active" | "Inactive" })
                }
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 