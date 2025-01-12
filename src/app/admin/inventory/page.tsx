"use client";
import React, { useState, useEffect } from "react";
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete } from "react-icons/md";
import { inventoryApi } from "@/services/api/inventory";
import { IInventory } from "@/models/Inventory";
import { getErrorMessage } from "@/utils/apiUtils";
import AddInventoryModal from "./AddInventoryModal";
import EditInventoryModal from "./EditInventoryModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function InventoryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inventoryItems, setInventoryItems] = useState<IInventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<IInventory | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [deleteItem, setDeleteItem] = useState<IInventory | null>(null);
    const [statusFilter, setStatusFilter] = useState("");

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
                return { color: "text-green-500 bg-green-50", text: "In Stock" };
            case "Low Stock":
                return { color: "text-yellow-500 bg-yellow-50", text: "Low Stock" };
            case "Out of Stock":
                return { color: "text-red-500 bg-red-50", text: "Out of Stock" };
            default:
                return { color: "text-gray-500 bg-gray-50", text: "Unknown" };
        }
    };

    const handleEdit = (item: IInventory) => {
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-[#FF914D] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    <MdAdd size={20} />
                    Add New Item
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
                <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <MdSearch className="text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search inventory..."
                                    className="bg-transparent outline-none w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <select
                                className="px-4 py-2 border rounded-lg min-w-[150px]"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="p-4 min-w-full lg:min-w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3">Item Details</th>
                                    <th className="text-right p-3 hidden sm:table-cell">Size</th>
                                    <th className="text-right p-3">Quantity</th>
                                    <th className="text-right p-3 hidden sm:table-cell">Purchase Rate</th>
                                    <th className="text-right p-3 hidden sm:table-cell">Sale Rate</th>
                                    <th className="text-center p-3 hidden sm:table-cell">Status</th>
                                    <th className="text-right p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8">
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-[#FF914D] border-t-transparent rounded-full animate-spin" />
                                                Loading...
                                            </div>
                                        </td>
                                    </tr>
                                ) : inventoryItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            No items found
                                        </td>
                                    </tr>
                                ) : (
                                    inventoryItems.map((item, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="p-3">
                                                <div className="font-medium">{item.marbleType}</div>
                                                <div className="text-sm text-gray-500">{item.location}</div>
                                            </td>
                                            <td className="p-3 hidden sm:table-cell">{item.size}</td>
                                            <td className="p-3 text-right">{item.quantity}</td>
                                            <td className="p-3 text-right hidden sm:table-cell">₨{item.purchaseRate.toLocaleString()}</td>
                                            <td className="p-3 text-right hidden sm:table-cell">₨{item.saleRate.toLocaleString()}</td>
                                            <td className="p-3 hidden sm:table-cell">
                                                <div className="flex justify-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-sm ${getStatusColor(item.status).color}`}
                                                    >
                                                        {getStatusColor(item.status).text}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <MdEdit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteItem(item)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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