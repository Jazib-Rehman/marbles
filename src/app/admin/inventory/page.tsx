"use client";
import React, { useState, useEffect } from "react";
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete } from "react-icons/md";
import AddInventoryModal from "./AddInventoryModal";
import { inventoryApi, InventoryItem } from "@/services/api/inventory";
import { getErrorMessage } from "@/utils/apiUtils";
import EditInventoryModal from "./EditInventoryModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

  const fetchInventory = async (search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await inventoryApi.getAll(search);
      setInventoryItems(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchInventory(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-500 bg-green-50";
      case "Low Stock":
        return "text-yellow-500 bg-yellow-50";
      case "Out of Stock":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem?._id) return;

    try {
      setIsDeleting(deleteItem._id);
      await inventoryApi.delete(deleteItem._id);
      fetchInventory(searchQuery);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(null);
      setDeleteItem(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF914D] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MdAdd size={20} />
          Add Item
        </button>
      </div>

      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchInventory(searchQuery)}
      />

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
              placeholder="Search inventory..."
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
                <th className="text-left p-3">Marble Type</th>
                <th className="text-left p-3">Size</th>
                <th className="text-left p-3">Quantity (ft)</th>
                <th className="text-left p-3">Purchase Rate</th>
                <th className="text-left p-3">Sale Rate</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : inventoryItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                inventoryItems.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{item.marbleType}</div>
                        {item.location && (
                          <div className="text-sm text-gray-500">
                            Location: {item.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{item.size}</td>
                    <td className="p-3">{item.quantity}</td>
                        <td className="p-3">₨{item?.purchaseRate?.toLocaleString()}/ft</td>
                        <td className="p-3">₨{item?.saleRate?.toLocaleString()}/ft</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                          item.status || "In Stock"
                        )}`}
                      >
                        {item.status || "In Stock"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Delete"
                          onClick={() => setDeleteItem(item)}
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

      {selectedItem && (
        <EditInventoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={() => fetchInventory(searchQuery)}
          item={selectedItem}
        />
      )}

      {deleteItem && (
        <DeleteConfirmModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting === deleteItem._id}
          itemName={`${deleteItem.marbleType} (${deleteItem.size})`}
        />
      )}
    </div>
  );
} 