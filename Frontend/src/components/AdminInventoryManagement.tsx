import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Edit, Trash2, AlertTriangle, ArrowDown, ArrowUp, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleBasedAccess from './RoleBasedAccess';

// Mock inventory data
interface InventoryItem {
  id: string;
  name: string;
  category: 'bike' | 'spare_part';
  subcategory: string;
  quantity: number;
  threshold: number;
  price: number;
  lastRestocked: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Hero Splendor+', category: 'bike', subcategory: 'Motorcycle', quantity: 5, threshold: 2, price: 75000, lastRestocked: '2023-04-05' },
  { id: '2', name: 'Hero HF Deluxe', category: 'bike', subcategory: 'Motorcycle', quantity: 3, threshold: 2, price: 65000, lastRestocked: '2023-04-02' },
  { id: '3', name: 'Hero Glamour', category: 'bike', subcategory: 'Motorcycle', quantity: 2, threshold: 2, price: 85000, lastRestocked: '2023-04-01' },
  { id: '4', name: 'Engine Oil (1L)', category: 'spare_part', subcategory: 'Lubricants', quantity: 25, threshold: 10, price: 450, lastRestocked: '2023-04-10' },
  { id: '5', name: 'Oil Filter', category: 'spare_part', subcategory: 'Filters', quantity: 15, threshold: 5, price: 120, lastRestocked: '2023-04-08' },
  { id: '6', name: 'Air Filter', category: 'spare_part', subcategory: 'Filters', quantity: 8, threshold: 10, price: 350, lastRestocked: '2023-04-07' },
  { id: '7', name: 'Brake Pads (Pair)', category: 'spare_part', subcategory: 'Brakes', quantity: 12, threshold: 8, price: 600, lastRestocked: '2023-04-06' },
  { id: '8', name: 'Spark Plug', category: 'spare_part', subcategory: 'Ignition', quantity: 20, threshold: 15, price: 150, lastRestocked: '2023-04-04' },
];

const AdminInventoryManagement: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'bikes' | 'spare_parts' | 'low_stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter inventory based on active tab, search term, and sorting
  const filteredInventory = mockInventory.filter(item => {
    // Filter by tab
    if (activeTab === 'bikes' && item.category !== 'bike') return false;
    if (activeTab === 'spare_parts' && item.category !== 'spare_part') return false;
    if (activeTab === 'low_stock' && item.quantity > item.threshold) return false;

    // Filter by search term
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    return true;
  });

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'quantity') {
      comparison = a.quantity - b.quantity;
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate inventory stats
  const totalItems = mockInventory.length;
  const totalBikes = mockInventory.filter(item => item.category === 'bike').length;
  const totalSpareParts = mockInventory.filter(item => item.category === 'spare_part').length;
  const lowStockItems = mockInventory.filter(item => item.quantity <= item.threshold).length;

  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access Inventory Management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Inventory Management</h2>
        <p className="text-gray-600">Manage bikes and spare parts inventory</p>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin Inventory Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Add new bikes and spare parts for workshop use</li>
            <li>Monitor stock levels and set low-stock thresholds</li>
            <li>Track inventory usage and restocking needs</li>
          </ul>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col">
          <div className="flex items-center mb-1">
            <Package className="text-blue-600 w-4 h-4 mr-2" />
            <span className="text-sm text-blue-800">Total Items</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex flex-col">
          <div className="flex items-center mb-1">
            <Package className="text-green-600 w-4 h-4 mr-2" />
            <span className="text-sm text-green-800">Bikes</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{totalBikes}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 flex flex-col">
          <div className="flex items-center mb-1">
            <Package className="text-purple-600 w-4 h-4 mr-2" />
            <span className="text-sm text-purple-800">Spare Parts</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{totalSpareParts}</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 flex flex-col">
          <div className="flex items-center mb-1">
            <AlertTriangle className="text-amber-600 w-4 h-4 mr-2" />
            <span className="text-sm text-amber-800">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{lowStockItems}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Items
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'bikes' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bikes')}
        >
          Bikes
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'spare_parts' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('spare_parts')}
        >
          Spare Parts
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'low_stock' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('low_stock')}
        >
          Low Stock {lowStockItems > 0 && <span className="ml-1 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">{lowStockItems}</span>}
        </button>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search inventory..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>

        <div className="flex space-x-2 w-full md:w-auto">
          <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors flex-grow md:flex-grow-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </RoleBasedAccess>

          <button className="border border-gray-300 rounded-lg px-3 py-2 flex items-center space-x-1 text-gray-700">
            <BarChart2 className="w-4 h-4" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th
                className="px-4 py-2 text-left font-medium text-gray-500 cursor-pointer"
                onClick={() => {
                  if (sortBy === 'name') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('name');
                    setSortOrder('asc');
                  }
                }}
              >
                <div className="flex items-center">
                  Item Name
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Category</th>
              <th
                className="px-4 py-2 text-left font-medium text-gray-500 cursor-pointer"
                onClick={() => {
                  if (sortBy === 'quantity') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('quantity');
                    setSortOrder('asc');
                  }
                }}
              >
                <div className="flex items-center">
                  Quantity
                  {sortBy === 'quantity' && (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left font-medium text-gray-500 cursor-pointer"
                onClick={() => {
                  if (sortBy === 'price') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('price');
                    setSortOrder('asc');
                  }
                }}
              >
                <div className="flex items-center">
                  Price
                  {sortBy === 'price' && (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Last Restocked</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="capitalize">{item.subcategory}</span>
                </td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">₹{item.price.toLocaleString()}</td>
                <td className="px-4 py-3 hidden lg:table-cell">{item.lastRestocked}</td>
                <td className="px-4 py-3">
                  {item.quantity <= item.threshold ? (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1"
                        aria-label="Edit item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </RoleBasedAccess>
                    <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </RoleBasedAccess>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedInventory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No inventory items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventoryManagement;
