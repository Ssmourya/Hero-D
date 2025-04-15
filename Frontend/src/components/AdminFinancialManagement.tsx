import React, { useState } from 'react';
import { DollarSign, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Filter, Calendar, Download, Plus, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleBasedAccess from './RoleBasedAccess';

// Mock financial data
interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  paymentMethod: 'cash' | 'online' | 'card';
  status: 'pending' | 'approved' | 'rejected';
}

const mockTransactions: FinancialTransaction[] = [
  { id: '1', date: '2023-04-12', description: 'Service Revenue - Oil Change', category: 'Service', amount: 1500, type: 'income', paymentMethod: 'cash', status: 'approved' },
  { id: '2', date: '2023-04-11', description: 'Service Revenue - Engine Repair', category: 'Service', amount: 3500, type: 'income', paymentMethod: 'online', status: 'approved' },
  { id: '3', date: '2023-04-10', description: 'Bike Sale - Hero Splendor+', category: 'Sales', amount: 75000, type: 'income', paymentMethod: 'card', status: 'approved' },
  { id: '4', date: '2023-04-10', description: 'Workshop Supplies', category: 'Inventory', amount: 2500, type: 'expense', paymentMethod: 'cash', status: 'approved' },
  { id: '5', date: '2023-04-09', description: 'Utility Bills', category: 'Utilities', amount: 1200, type: 'expense', paymentMethod: 'online', status: 'approved' },
  { id: '6', date: '2023-04-08', description: 'Service Revenue - Joyride', category: 'Service', amount: 1200, type: 'income', paymentMethod: 'cash', status: 'approved' },
  { id: '7', date: '2023-04-08', description: 'Engine Oil Purchase', category: 'Inventory', amount: 3500, type: 'expense', paymentMethod: 'cash', status: 'pending' },
  { id: '8', date: '2023-04-07', description: 'Staff Salary', category: 'Salary', amount: 15000, type: 'expense', paymentMethod: 'online', status: 'pending' },
];

// Calculate financial summary
const calculateSummary = () => {
  const approvedTransactions = mockTransactions.filter(t => t.status === 'approved');

  const cashInHand = approvedTransactions
    .filter(t => t.paymentMethod === 'cash' && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) -
    approvedTransactions
    .filter(t => t.paymentMethod === 'cash' && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const onlinePayments = approvedTransactions
    .filter(t => (t.paymentMethod === 'online' || t.paymentMethod === 'card') && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = approvedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = approvedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return { cashInHand, onlinePayments, expenses, totalIncome };
};

const AdminFinancialManagement: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'transactions' | 'approvals' | 'reports'>('transactions');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const summary = calculateSummary();

  // Filter transactions based on category and type
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesCategory = categoryFilter ? transaction.category === categoryFilter : true;
    const matchesType = typeFilter ? transaction.type === typeFilter : true;

    return matchesCategory && matchesType;
  });

  // Get pending transactions for approvals
  const pendingTransactions = mockTransactions.filter(t => t.status === 'pending');

  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access Financial Management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Financial Management</h2>
        <p className="text-gray-600">Track income, expenses, and manage financial transactions</p>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin Financial Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Track cash-in-hand (₹{summary.cashInHand}), online payments (₹{summary.onlinePayments}), and expenses (₹{summary.expenses})</li>
            <li>Record service revenue and categorize expenses (e.g., oil, labor)</li>
            <li>Approve or reject financial transactions</li>
          </ul>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Wallet className="text-green-600 w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium text-green-800">Cash in Hand</h3>
          </div>
          <p className="text-2xl font-bold text-green-900">₹{summary.cashInHand}</p>
          <div className="flex items-center mt-2 text-xs text-green-700">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>From approved cash transactions</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CreditCard className="text-blue-600 w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium text-blue-800">Online Payments</h3>
          </div>
          <p className="text-2xl font-bold text-blue-900">₹{summary.onlinePayments}</p>
          <div className="flex items-center mt-2 text-xs text-blue-700">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>Card and online transactions</span>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ArrowDownRight className="text-red-600 w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-red-900">₹{summary.expenses}</p>
          <div className="flex items-center mt-2 text-xs text-red-700">
            <ArrowDownRight className="w-3 h-3 mr-1" />
            <span>Total approved expenses</span>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="text-purple-600 w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium text-purple-800">Total Income</h3>
          </div>
          <p className="text-2xl font-bold text-purple-900">₹{summary.totalIncome}</p>
          <div className="flex items-center mt-2 text-xs text-purple-700">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>Total approved income</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'transactions' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'approvals' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('approvals')}
        >
          Approvals {pendingTransactions.length > 0 && <span className="ml-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs">{pendingTransactions.length}</span>}
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'reports' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {activeTab === 'transactions' && (
        <>
          {/* Filters and Actions */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Service">Service</option>
                <option value="Sales">Sales</option>
                <option value="Inventory">Inventory</option>
                <option value="Utilities">Utilities</option>
                <option value="Salary">Salary</option>
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <button className="border border-gray-300 rounded-lg px-3 py-2 flex items-center space-x-1 text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Date Range</span>
              </button>
            </div>

            <div className="flex space-x-2 w-full md:w-auto">
              <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors flex-grow md:flex-grow-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Transaction</span>
                </button>
              </RoleBasedAccess>

              <button className="border border-gray-300 rounded-lg px-3 py-2 flex items-center space-x-1 text-gray-700">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Description</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Category</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Payment Method</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{transaction.date}</td>
                    <td className="px-4 py-3">{transaction.description}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{transaction.category}</td>
                    <td className="px-4 py-3">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell capitalize">{transaction.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found matching your criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'approvals' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
              {pendingTransactions.length} pending
            </span>
          </div>

          {pendingTransactions.length > 0 ? (
            <div className="space-y-4">
              {pendingTransactions.map(transaction => (
                <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                    <div>
                      <h4 className="font-medium">{transaction.description}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.date} • {transaction.category} • {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm hover:bg-green-200 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm hover:bg-red-200 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No pending approvals at this time.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'reports' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Financial Reports</h3>
            <p className="text-gray-600">Generate and download financial reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">Income Statement</h4>
              <p className="text-sm text-gray-600 mb-4">Summary of income and expenses for a specific period</p>
              <div className="flex justify-between items-center">
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option>Last 30 days</option>
                  <option>This month</option>
                  <option>Last month</option>
                  <option>This quarter</option>
                  <option>Custom range</option>
                </select>
                <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">Service Revenue Report</h4>
              <p className="text-sm text-gray-600 mb-4">Breakdown of revenue by service type</p>
              <div className="flex justify-between items-center">
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option>Last 30 days</option>
                  <option>This month</option>
                  <option>Last month</option>
                  <option>This quarter</option>
                  <option>Custom range</option>
                </select>
                <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">Expense Report</h4>
              <p className="text-sm text-gray-600 mb-4">Detailed breakdown of expenses by category</p>
              <div className="flex justify-between items-center">
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option>Last 30 days</option>
                  <option>This month</option>
                  <option>Last month</option>
                  <option>This quarter</option>
                  <option>Custom range</option>
                </select>
                <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFinancialManagement;
