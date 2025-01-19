"use client";
import React, { useState, useEffect } from "react";
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdBusiness, MdPerson } from "react-icons/md";
import AddCustomerModal from "./AddCustomerModal";
import { customerApi } from "@/services/api/customer";
import { IB2BCustomer, IB2CCustomer } from "@/models/Customer";
import { getErrorMessage } from "@/utils/apiUtils";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";
import CustomerDetailsModal from "./CustomerDetailsModal";

type CustomerType = "B2B" | "B2C";

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<CustomerType>("B2B");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<(IB2BCustomer | IB2CCustomer)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState<IB2BCustomer | IB2CCustomer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<IB2BCustomer | IB2CCustomer | null>(null);

  const fetchCustomers = async (search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await customerApi.getAll(search, activeTab);
      setCustomers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [activeTab, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async () => {
    if (!editCustomer?._id) return;

    try {
      setIsDeleting(editCustomer._id);
      await customerApi.delete(editCustomer._id);
      fetchCustomers(searchQuery);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(null);
      setEditCustomer(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF914D] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MdAdd size={20} />
          Add Customer
        </button>
      </div>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchCustomers(searchQuery);
          setIsModalOpen(false);
        }}
        initialType={activeTab}
      />

      {/* Customer Type Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("B2B")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "B2B"
              ? "bg-[#FF914D] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <MdBusiness size={20} />
          Business Customers
        </button>
        <button
          onClick={() => setActiveTab("B2C")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "B2C"
              ? "bg-[#FF914D] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <MdPerson size={20} />
          Individual Customers
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg w-full md:w-96">
            <MdSearch className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab === "B2B" ? "business" : "individual"} customers...`}
              className="bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <MdFilterList size={20} />
            Filter
          </button>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === "B2B" ? (
                  <>
                    <th className="text-left p-3">Business Name</th>
                    <th className="text-left p-3 hidden md:table-cell">Contact Person</th>
                    <th className="text-left p-3 hidden md:table-cell">Business Type</th>
                  </>
                ) : (
                  <>
                    <th className="text-left p-3">Customer Name</th>
                    <th className="text-left p-3 hidden md:table-cell">Phone</th>
                    <th className="text-left p-3 hidden md:table-cell">Address</th>
                  </>
                )}
                <th className="text-left p-3">Contact</th>
                <th className="text-left p-3 hidden md:table-cell">Total Orders</th>
                <th className="text-left p-3 hidden md:table-cell">Total Spent</th>
                <th className="text-left p-3 hidden md:table-cell">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer,i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {activeTab === "B2B" ? (
                      // B2B Customer Row
                      <>
                        <td className="p-3">
                          <div 
                            className="font-medium cursor-pointer hover:text-[#FF914D]"
                            onClick={() => setViewCustomer(customer)}
                          >
                            {(customer as IB2BCustomer).businessName}
                          </div>
                          <div className="text-sm text-gray-500">{customer.city}</div>
                        </td>
                        <td className="p-3 hidden md:table-cell">{(customer as IB2BCustomer).contactPerson}</td>
                        <td className="p-3 hidden md:table-cell">{(customer as IB2BCustomer).businessType}</td>
                      </>
                    ) : (
                      // B2C Customer Row
                      <>
                        <td className="p-3">
                          <div 
                            className="font-medium cursor-pointer hover:text-[#FF914D]"
                            onClick={() => setViewCustomer(customer)}
                          >
                            {`${(customer as IB2CCustomer).firstName} ${
                              (customer as IB2CCustomer).lastName
                            }`}
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">{customer.phone}</td>
                        <td className="p-3 hidden md:table-cell">{customer.address}</td>
                      </>
                    )}
                    <td className="p-3">
                      <div>{customer.phone}</div>
                      {customer.email && (
                        <div className="text-sm text-gray-500 truncate w-24">{customer.email}</div>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell">{customer.totalOrders}</td>
                    <td className="p-3 hidden md:table-cell">₨ {customer.totalSpent.toLocaleString()}</td>
                    <td className="p-3 hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          customer.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Edit"
                          onClick={() => setEditCustomer(customer)}
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Delete"
                          onClick={() => setEditCustomer(customer)}
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editCustomer && (
        <EditCustomerModal
          isOpen={!!editCustomer}
          onClose={() => setEditCustomer(null)}
          onSuccess={() => {
            fetchCustomers(searchQuery);
            setEditCustomer(null);
          }}
          customer={editCustomer}
        />
      )}

      {viewCustomer && (
        <CustomerDetailsModal
          isOpen={!!viewCustomer}
          onClose={() => setViewCustomer(null)}
          customer={viewCustomer}
        />
      )}
    </div>
  );
} 