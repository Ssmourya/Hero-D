import React, { useState, useEffect } from 'react';
import { Users, Wrench, DollarSign, Package, FileText, BarChart3, ShoppingCart, UserPlus, AlertCircle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleBasedAccess from './RoleBasedAccess';
import { useNavigate } from 'react-router-dom';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  colorClass: string;
  onClick?: () => void;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon,
  description,
  colorClass,
  onClick
}) => {
  return (
    <div
      className={`${colorClass} rounded-lg shadow-md p-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-30">
          {icon}
        </div>
      </div>
      {description && <p className="text-sm mt-auto">{description}</p>}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalRevenue: 0,
    cashInHand: 71440,
    onlinePayments: 8115,
    expenses: 710,
    inventoryItems: 0,
    pendingApprovals: 0,
    pendingExpenses: 0,
    pendingTransactions: 0
  });

  // Define types for pending items
  interface PendingExpense {
    id: string;
    type: string;
    amount: number;
    requestedBy: string;
    date: string;
  }

  interface PendingTransaction {
    id: string;
    type: string;
    amount: number;
    customer: string;
    date: string;
  }

  interface PendingService {
    id: string;
    type: string;
    amount: number;
    customer: string;
    date: string;
  }

  const [pendingItems, setPendingItems] = useState<{
    expenses: PendingExpense[];
    transactions: PendingTransaction[];
    services: PendingService[];
  }>({
    expenses: [],
    transactions: [],
    services: []
  });

  useEffect(() => {
    // In a real application, this would be an API call to fetch system stats
    const fetchSystemStats = async () => {
      try {
        // Simulate API call
        setLoading(true);

        // In a real app, this would be:
        // const response = await fetch('/api/admin/system-stats');
        // const data = await response.json();

        // Simulated data
        setTimeout(() => {
          setStats({
            totalUsers: 15,
            totalServices: 23,
            totalRevenue: 6685,
            cashInHand: 71440,
            onlinePayments: 8115,
            expenses: 710,
            inventoryItems: 45,
            pendingApprovals: 3,
            pendingExpenses: 2,
            pendingTransactions: 1
          });

          // Simulated pending items
          setPendingItems({
            expenses: [
              { id: 'exp1', type: 'Oil Change', amount: 450, requestedBy: 'John Doe', date: '2023-04-12' },
              { id: 'exp2', type: 'Spare Parts', amount: 1200, requestedBy: 'Jane Smith', date: '2023-04-11' }
            ],
            transactions: [
              { id: 'tr1', type: 'Refund', amount: 1500, customer: 'Rajesh Kumar', date: '2023-04-10' }
            ],
            services: [
              { id: 'srv1', type: 'Engine Repair', amount: 3500, customer: 'Amit Singh', date: '2023-04-09' }
            ]
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching system stats:', error);
        setLoading(false);
      }
    };

    fetchSystemStats();

    // Set up a refresh interval for real-time updates
    const refreshInterval = setInterval(fetchSystemStats, 60000); // Refresh every minute

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Only Admin and Owner should access this dashboard
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to view the Admin Dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex space-x-2">
          <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
            <button
              onClick={() => window.location.href = '/admin/user-management'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
            >
              <UserPlus size={18} />
              <span>Add New User</span>
            </button>
          </RoleBasedAccess>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">System-Wide Access</h3>
        <p className="text-gray-600 mb-3">As an Admin, you have full access to:</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Add, update, view, and delete records for products, employees, customers, financials, and services</li>
          <li>Manage user accounts and permissions</li>
          <li>Approve or reject transactions and expenses</li>
          <li>Generate and export reports</li>
        </ul>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} className="text-blue-600" />}
          colorClass="bg-blue-50"
          description="Active user accounts"
        />
        <AdminStatCard
          title="Workshop Services"
          value={stats.totalServices}
          icon={<Wrench size={24} className="text-green-600" />}
          colorClass="bg-green-50"
          description="Total services"
        />
        <AdminStatCard
          title="Service Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={<DollarSign size={24} className="text-purple-600" />}
          colorClass="bg-purple-50"
          description="Total service revenue"
        />
        <AdminStatCard
          title="Inventory Items"
          value={stats.inventoryItems}
          icon={<Package size={24} className="text-amber-600" />}
          colorClass="bg-amber-50"
          description="Bikes and spare parts"
        />
      </div>

      {/* Financial Overview */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatCard
            title="Cash in Hand"
            value={`₹${stats.cashInHand}`}
            icon={<DollarSign size={24} className="text-green-600" />}
            colorClass="bg-green-50"
          />
          <AdminStatCard
            title="Online Payments"
            value={`₹${stats.onlinePayments}`}
            icon={<ShoppingCart size={24} className="text-blue-600" />}
            colorClass="bg-blue-50"
          />
          <AdminStatCard
            title="Expenses"
            value={`₹${stats.expenses}`}
            icon={<FileText size={24} className="text-red-600" />}
            colorClass="bg-red-50"
          />
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Pending Approvals</h3>
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {stats.pendingApprovals} pending
          </span>
        </div>

        {stats.pendingApprovals > 0 ? (
          <div className="space-y-4">
            {/* Pending Expenses */}
            {pendingItems.expenses.map(expense => (
              <div key={expense.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h4 className="font-medium">Service Expense Approval</h4>
                  <p className="text-sm text-gray-600">{expense.type} - ₹{expense.amount}</p>
                  <p className="text-xs text-gray-500">Requested by: {expense.requestedBy} on {expense.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to approve the expense
                      alert(`Expense ${expense.id} approved`);
                      // Then update the state to remove this item
                      setPendingItems(prev => ({
                        ...prev,
                        expenses: prev.expenses.filter(e => e.id !== expense.id)
                      }));
                    }}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to reject the expense
                      alert(`Expense ${expense.id} rejected`);
                      // Then update the state to remove this item
                      setPendingItems(prev => ({
                        ...prev,
                        expenses: prev.expenses.filter(e => e.id !== expense.id)
                      }));
                    }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {/* Pending Transactions */}
            {pendingItems.transactions.map(transaction => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h4 className="font-medium">Payment {transaction.type} Request</h4>
                  <p className="text-sm text-gray-600">Customer: {transaction.customer} - ₹{transaction.amount}</p>
                  <p className="text-xs text-gray-500">Requested on {transaction.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to approve the transaction
                      alert(`Transaction ${transaction.id} approved`);
                      // Then update the state to remove this item
                      setPendingItems(prev => ({
                        ...prev,
                        transactions: prev.transactions.filter(t => t.id !== transaction.id)
                      }));
                    }}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to reject the transaction
                      alert(`Transaction ${transaction.id} rejected`);
                      // Then update the state to remove this item
                      setPendingItems(prev => ({
                        ...prev,
                        transactions: prev.transactions.filter(t => t.id !== transaction.id)
                      }));
                    }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {/* Pending Services */}
            {pendingItems.services.map(service => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h4 className="font-medium">New Service Approval</h4>
                  <p className="text-sm text-gray-600">{service.type} - ₹{service.amount}</p>
                  <p className="text-xs text-gray-500">Customer: {service.customer} on {service.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to approve the service
                      alert(`Service ${service.id} approved`);
                      // Then update the state to remove this item
                      setPendingItems(prev => ({
                        ...prev,
                        services: prev.services.filter(s => s.id !== service.id)
                      }));
                    }}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would call an API to reject the service
                      alert(`Service ${service.id} rejected`);
                      // Then update the state to remove this item
                      setPendingItems(prev => ({
                        ...prev,
                        services: prev.services.filter(s => s.id !== service.id)
                      }));
                    }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending approvals</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Admin Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/user-management')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Users size={24} className="text-blue-600 mb-2" />
            <span className="text-sm">User Management</span>
          </button>
          <button
            onClick={() => navigate('/admin/workshop-management')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Wrench size={24} className="text-green-600 mb-2" />
            <span className="text-sm">Workshop Management</span>
          </button>
          <button
            onClick={() => navigate('/admin/financial-management')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <DollarSign size={24} className="text-purple-600 mb-2" />
            <span className="text-sm">Financial Management</span>
          </button>
          <button
            onClick={() => navigate('/admin/reports')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <BarChart3 size={24} className="text-red-600 mb-2" />
            <span className="text-sm">Reports</span>
          </button>
          <button
            onClick={() => navigate('/admin/inventory-management')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Package size={24} className="text-amber-600 mb-2" />
            <span className="text-sm">Inventory</span>
          </button>
          <button
            onClick={() => navigate('/admin/system-settings')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Shield size={24} className="text-indigo-600 mb-2" />
            <span className="text-sm">System Settings</span>
          </button>
          <button
            onClick={() => navigate('/admin/audit-logs')}
            className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <AlertCircle size={24} className="text-orange-600 mb-2" />
            <span className="text-sm">Audit Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
