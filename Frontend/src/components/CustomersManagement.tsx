import React from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface CustomersManagementProps {
  customersData: Customer[];
  openModal: (type: 'create' | 'edit' | 'view' | 'delete', title: string, item?: any) => void;
}

const CustomersManagement: React.FC<CustomersManagementProps> = ({ customersData, openModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">Customers Management</h3>
        <button
          onClick={() => openModal('create', 'Add New Customer')}
          className="bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-800 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </button>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-xs sm:text-sm">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-gray-50 border-b">
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Name</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Phone</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Email</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden xl:table-cell">Address</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customersData.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50 flex flex-col sm:table-row mb-4 sm:mb-0 rounded shadow-md sm:shadow-none sm:rounded-none bg-white sm:bg-transparent p-3 sm:p-0">
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block">
                  <span className="font-medium sm:hidden mb-1">Name:</span>
                  {customer.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block md:table-cell">
                  <span className="font-medium sm:hidden mb-1">Phone:</span>
                  {customer.phone}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block lg:table-cell">
                  <span className="font-medium sm:hidden mb-1">Email:</span>
                  {customer.email}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block xl:table-cell">
                  <span className="font-medium sm:hidden mb-1">Address:</span>
                  {customer.address}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className="font-medium sm:hidden mb-1">Actions:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('view', 'View Customer', customer)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="View customer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit', 'Edit Customer', customer)}
                      className="text-green-500 hover:text-green-700 p-1"
                      aria-label="Edit customer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('delete', 'Delete Customer', customer)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Delete customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersManagement;
