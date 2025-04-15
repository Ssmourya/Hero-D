import React from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { User } from '../services/userService';
import RoleBasedAccess from './RoleBasedAccess';
import { useAuth } from '../context/AuthContext';

interface UsersManagementProps {
  usersData: User[];
  openModal: (type: 'create' | 'edit' | 'view' | 'delete', title: string, item?: any) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ usersData, openModal }) => {
  const { isOwner } = useAuth();
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">Users Management</h3>
        <RoleBasedAccess allowedRoles="Owner">
          <button
            onClick={() => openModal('create', 'Add New User')}
            className="bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-800 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4 mr-2" /> Add User
          </button>
        </RoleBasedAccess>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-xs sm:text-sm">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-gray-50 border-b">
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Name</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Role</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Email</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Status</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map(user => (
              <tr key={user._id || user.id} className="border-b hover:bg-gray-50 flex flex-col sm:table-row mb-4 sm:mb-0 rounded shadow-md sm:shadow-none sm:rounded-none bg-white sm:bg-transparent p-3 sm:p-0">
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block">
                  <span className="font-medium sm:hidden mb-1">Name:</span>
                  {user.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block md:table-cell">
                  <span className="font-medium sm:hidden mb-1">Role:</span>
                  {user.role}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block lg:table-cell">
                  <span className="font-medium sm:hidden mb-1">Email:</span>
                  {user.email}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block">
                  <span className="font-medium sm:hidden mb-1">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs inline-block w-fit">{user.status}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className="font-medium sm:hidden mb-1">Actions:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('view', 'View User', user)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="View user"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <RoleBasedAccess allowedRoles="Owner">
                      <button
                        onClick={() => openModal('edit', 'Edit User', user)}
                        className="text-green-500 hover:text-green-700 p-1"
                        aria-label="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </RoleBasedAccess>
                    <RoleBasedAccess allowedRoles="Owner">
                      <button
                        onClick={() => openModal('delete', 'Delete User', user)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Delete user"
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
      </div>
    </div>
  );
};

export default UsersManagement;
