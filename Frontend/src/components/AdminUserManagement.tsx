import React, { useState, useEffect } from 'react';
import { Edit, Eye, Plus, Trash2, Search, Filter, UserPlus, Clock, Shield, CheckCircle, XCircle, AlertTriangle, History } from 'lucide-react';
import RoleBasedAccess from './RoleBasedAccess';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

// User interface
interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Workshop';
  status: 'Active' | 'Inactive' | 'Locked';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-04-12 09:30:45',
    createdAt: '2022-01-15',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Sunil Sharma',
    email: 'sunil@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2023-04-12 08:15:22',
    createdAt: '2022-02-20',
    permissions: ['manage:workshop', 'view:reports']
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya@example.com',
    role: 'Staff',
    status: 'Active',
    lastLogin: '2023-04-11 17:45:10',
    createdAt: '2022-03-10',
    permissions: ['view:dashboard', 'manage:services']
  },
  {
    id: '4',
    name: 'Amit Singh',
    email: 'amit@example.com',
    role: 'Workshop',
    status: 'Active',
    lastLogin: '2023-04-11 14:20:33',
    createdAt: '2022-04-05',
    permissions: ['manage:services']
  },
  {
    id: '5',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    role: 'Staff',
    status: 'Inactive',
    lastLogin: '2023-04-10 10:05:18',
    createdAt: '2022-05-15',
    permissions: ['view:dashboard']
  },
];

// Activity log interface
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// Mock activity logs
const mockActivityLogs: ActivityLog[] = [
  { id: '1', userId: '1', userName: 'Rajesh Kumar', action: 'User Created', details: 'Created user: Vikram Patel', timestamp: '2023-04-12 10:30:45', ipAddress: '192.168.1.101' },
  { id: '2', userId: '1', userName: 'Rajesh Kumar', action: 'Permission Updated', details: 'Updated permissions for: Sunil Sharma', timestamp: '2023-04-12 10:15:22', ipAddress: '192.168.1.101' },
  { id: '3', userId: '2', userName: 'Sunil Sharma', action: 'Service Added', details: 'Added new service: Engine Tuning', timestamp: '2023-04-11 16:45:10', ipAddress: '192.168.1.102' },
  { id: '4', userId: '3', userName: 'Priya Patel', action: 'Payment Recorded', details: 'Recorded payment of ₹1,500 for service #S123', timestamp: '2023-04-11 14:20:33', ipAddress: '192.168.1.103' },
  { id: '5', userId: '1', userName: 'Rajesh Kumar', action: 'User Deactivated', details: 'Deactivated user: Neha Gupta', timestamp: '2023-04-10 11:05:18', ipAddress: '192.168.1.101' },
];

// Mock login history data
interface LoginHistory {
  userId: string;
  userName: string;
  loginTime: string;
  ipAddress: string;
  device: string;
}

const mockLoginHistory: LoginHistory[] = [
  { userId: '1', userName: 'Rajesh Kumar', loginTime: '2023-04-12 09:30:45', ipAddress: '192.168.1.101', device: 'Chrome / Windows' },
  { userId: '2', userName: 'Sunil Sharma', loginTime: '2023-04-12 08:15:22', ipAddress: '192.168.1.102', device: 'Safari / MacOS' },
  { userId: '3', userName: 'Priya Patel', loginTime: '2023-04-11 17:45:10', ipAddress: '192.168.1.103', device: 'Firefox / Windows' },
  { userId: '1', userName: 'Rajesh Kumar', loginTime: '2023-04-11 14:20:33', ipAddress: '192.168.1.101', device: 'Chrome / Windows' },
  { userId: '2', userName: 'Sunil Sharma', loginTime: '2023-04-10 10:05:18', ipAddress: '192.168.1.102', device: 'Safari / MacOS' },
];

const AdminUserManagement: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'loginHistory' | 'activityLogs'>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>(mockLoginHistory);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff',
    password: '',
    confirmPassword: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle add user form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Create user data object to send to API
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        status: 'Active'
      };

      // Call the API to create the user
      const newUser = await userService.createUser(userData);

      // Add the new user to the state
      setUsers([...users, {
        id: newUser._id || newUser.id || `${users.length + 1}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as 'Admin' | 'Manager' | 'Staff' | 'Workshop',
        status: newUser.status,
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        permissions: []
      }]);

      // Add to activity logs
      const newLog: ActivityLog = {
        id: `${activityLogs.length + 1}`,
        userId: '1', // Assuming current user is Admin with ID 1
        userName: 'Rajesh Kumar', // Assuming current user
        action: 'User Created',
        details: `Created user: ${formData.name}`,
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.101' // Mock IP
      };

      setActivityLogs([newLog, ...activityLogs]);

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        role: 'Staff',
        password: '',
        confirmPassword: ''
      });
      setShowAddUserModal(false);

      alert('User created successfully!');
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Failed to create user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  // Handle edit user form submission
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      // Create user data object to send to API
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: selectedUser.status
      };

      // Call the API to update the user
      const userId = selectedUser._id || selectedUser.id;
      const updatedUser = await userService.updateUser(userId.toString(), userData);

      // Update the user in the state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role as 'Admin' | 'Manager' | 'Staff' | 'Workshop'
          };
        }
        return user;
      });

      setUsers(updatedUsers);

      // Add to activity logs
      const newLog: ActivityLog = {
        id: `${activityLogs.length + 1}`,
        userId: '1', // Assuming current user is Admin with ID 1
        userName: 'Rajesh Kumar', // Assuming current user
        action: 'User Updated',
        details: `Updated user: ${formData.name}`,
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.101' // Mock IP
      };

      setActivityLogs([newLog, ...activityLogs]);

      // Reset form and close modal
      setSelectedUser(null);
      setShowEditUserModal(false);

      alert('User updated successfully!');
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(`Failed to update user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    // Find user to be deleted
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;

    try {
      // Call the API to delete the user
      const userIdToDelete = userToDelete._id || userToDelete.id;
      await userService.deleteUser(userIdToDelete.toString());

      // Remove user from state
      setUsers(users.filter(user => user.id !== userId));

      // Add to activity logs
      const newLog: ActivityLog = {
        id: `${activityLogs.length + 1}`,
        userId: '1', // Assuming current user is Admin with ID 1
        userName: 'Rajesh Kumar', // Assuming current user
        action: 'User Deleted',
        details: `Deleted user: ${userToDelete.name}`,
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.101' // Mock IP
      };

      setActivityLogs([newLog, ...activityLogs]);

      alert('User deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Failed to delete user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access User Management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">User Management</h2>
        <p className="text-gray-600">Manage user accounts, roles, and view login history</p>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin-Only Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Add new login records for Manager, Staff, and Workshop employees</li>
            <li>Edit or update login details (admin-only access)</li>
            <li>View login history and user activity logs</li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Users</span>
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'loginHistory' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('loginHistory')}
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Login History</span>
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'activityLogs' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('activityLogs')}
        >
          <div className="flex items-center">
            <History className="w-4 h-4 mr-1" />
            <span>Activity Logs</span>
          </div>
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              <div className="ml-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                  <option value="Manager">Manager</option>
                  <option value="Cashier">Cashier</option>
                  <option value="TELLYCALLER">TELLYCALLER</option>
                  <option value="Storekeeper">Storekeeper</option>
                  <option value="Staff">Staff</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors w-full md:w-auto justify-center md:justify-start"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New User</span>
              </button>
            </RoleBasedAccess>
          </div>

          {/* Users Table */}
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
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 flex flex-col sm:table-row mb-4 sm:mb-0 rounded shadow-md sm:shadow-none sm:rounded-none bg-white sm:bg-transparent p-3 sm:p-0">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block">
                      <span className="font-medium sm:hidden mb-1">Name:</span>
                      {user.name}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block md:table-cell">
                      <span className="font-medium sm:hidden mb-1">Role:</span>
                      <span className={`px-2 py-1 rounded-full text-xs inline-block w-fit ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Owner' ? 'bg-red-100 text-red-800' :
                        user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Staff' ? 'bg-green-100 text-green-800' :
                        user.role === 'Workshop' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block lg:table-cell">
                      <span className="font-medium sm:hidden mb-1">Email:</span>
                      {user.email}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:block">
                      <span className="font-medium sm:hidden mb-1">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs inline-block w-fit ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className="font-medium sm:hidden mb-1">Actions:</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            // In a real app, this would show a modal with user details
                            alert(`Viewing user: ${user.name}`);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="View user"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                password: '',
                                confirmPassword: ''
                              });
                              setShowEditUserModal(true);
                            }}
                            className="text-green-500 hover:text-green-700 p-1"
                            aria-label="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'loginHistory' ? (
        <>
          {/* Login History */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Login Activity</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>Last 7 days</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">User</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Login Time</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">IP Address</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Device</th>
                </tr>
              </thead>
              <tbody>
                {mockLoginHistory.map((entry, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{entry.userName}</td>
                    <td className="px-4 py-3">{entry.loginTime}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{entry.ipAddress}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{entry.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Activity Logs */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Activity Logs</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <History className="w-4 h-4 mr-1" />
              <span>System Audit Trail</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">User</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Details</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Timestamp</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${log.action.includes('Created') ? 'bg-green-100 text-green-800' :
                        log.action.includes('Updated') || log.action.includes('Permission') ? 'bg-blue-100 text-blue-800' :
                        log.action.includes('Deleted') || log.action.includes('Deactivated') ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{log.details}</td>
                    <td className="px-4 py-3">{log.timestamp}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit User: {selectedUser.name}</h3>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="edit-role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
