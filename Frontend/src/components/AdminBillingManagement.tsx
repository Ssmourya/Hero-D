import React, { useState } from 'react';
import { DollarSign, FileText, Search, Filter, Plus, Edit, Trash2, Download, CheckCircle, XCircle, Eye, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleBasedAccess from './RoleBasedAccess';

// Mock billing data
interface BillingRecord {
  id: string;
  date: string;
  customerName: string;
  customerContact: string;
  serviceType: string;
  amount: number;
  paymentMethod: 'cash' | 'online' | 'card';
  status: 'paid' | 'pending' | 'cancelled';
}

const mockBillingData: BillingRecord[] = [
  { id: '1', date: '2023-04-12', customerName: 'Rajesh Kumar', customerContact: '9876543210', serviceType: 'Oil Change', amount: 500, paymentMethod: 'cash', status: 'paid' },
  { id: '2', date: '2023-04-11', customerName: 'Sunil Sharma', customerContact: '8765432109', serviceType: 'Engine Tuning', amount: 1200, paymentMethod: 'online', status: 'paid' },
  { id: '3', date: '2023-04-10', customerName: 'Priya Patel', customerContact: '7654321098', serviceType: 'Full Service', amount: 2500, paymentMethod: 'card', status: 'paid' },
  { id: '4', date: '2023-04-10', customerName: 'Amit Singh', customerContact: '6543210987', serviceType: 'Brake Service', amount: 800, paymentMethod: 'cash', status: 'pending' },
  { id: '5', date: '2023-04-09', customerName: 'Neha Gupta', customerContact: '5432109876', serviceType: 'Joyride', amount: 200, paymentMethod: 'online', status: 'paid' },
  { id: '6', date: '2023-04-08', customerName: 'Vikram Patel', customerContact: '4321098765', serviceType: 'Engine Repair', amount: 1500, paymentMethod: 'cash', status: 'cancelled' },
];

// Mock quotation data
interface QuotationRecord {
  id: string;
  date: string;
  customerName: string;
  customerContact: string;
  serviceType: string;
  estimatedAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  generatedBy: string;
}

const mockQuotations: QuotationRecord[] = [
  { id: '1', date: '2023-04-12', customerName: 'Rahul Verma', customerContact: '9876543210', serviceType: 'Engine Repair', estimatedAmount: 1800, status: 'pending', generatedBy: 'Staff 1' },
  { id: '2', date: '2023-04-11', customerName: 'Deepak Kumar', customerContact: '8765432109', serviceType: 'Full Service', estimatedAmount: 2800, status: 'approved', generatedBy: 'Staff 2' },
  { id: '3', date: '2023-04-10', customerName: 'Anita Sharma', customerContact: '7654321098', serviceType: 'Brake Replacement', estimatedAmount: 1200, status: 'pending', generatedBy: 'Staff 1' },
];

const AdminBillingManagement: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'bills' | 'quotations'>('bills');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Calculate total revenue
  const totalRevenue = mockBillingData
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);
  
  // Filter billing data based on search term and status
  const filteredBillingData = mockBillingData.filter(bill => {
    const matchesSearch = 
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bill.customerContact.includes(searchTerm) ||
      bill.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? bill.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter quotations based on search term and status
  const filteredQuotations = mockQuotations.filter(quote => {
    const matchesSearch = 
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      quote.customerContact.includes(searchTerm) ||
      quote.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? quote.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get pending quotations
  const pendingQuotations = mockQuotations.filter(q => q.status === 'pending');

  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access Billing Management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Billing and Sales Management</h2>
        <p className="text-gray-600">Manage bills, quotations, and customer payments</p>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin Billing Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Generate and update bills for workshop services (e.g., ₹{totalRevenue} total service revenue)</li>
            <li>Record customer details (e.g., customer contact) and payment methods (e.g., online, cash)</li>
            <li>Approve quotations generated by Staff</li>
          </ul>
        </div>
      </div>
      
      {/* Revenue Summary */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <DollarSign className="text-green-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold text-green-800">Total Service Revenue</h3>
        </div>
        <p className="text-3xl font-bold text-green-900">₹{totalRevenue}</p>
        <p className="text-sm text-green-700 mt-2">From {mockBillingData.filter(bill => bill.status === 'paid').length} paid services</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'bills' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bills')}
        >
          Bills
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'quotations' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('quotations')}
        >
          Quotations {pendingQuotations.length > 0 && <span className="ml-1 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">{pendingQuotations.length}</span>}
        </button>
      </div>
      
      {activeTab === 'bills' && (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search bills..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              <div className="ml-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto">
              <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors flex-grow md:flex-grow-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Bill</span>
                </button>
              </RoleBasedAccess>
              
              <button className="border border-gray-300 rounded-lg px-3 py-2 flex items-center space-x-1 text-gray-700">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Bills Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Contact</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Service</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Payment</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBillingData.map(bill => (
                  <tr key={bill.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{bill.date}</td>
                    <td className="px-4 py-3">{bill.customerName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{bill.customerContact}</td>
                    <td className="px-4 py-3">{bill.serviceType}</td>
                    <td className="px-4 py-3 font-medium">₹{bill.amount}</td>
                    <td className="px-4 py-3 hidden lg:table-cell capitalize">{bill.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="View bill"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            className="text-green-500 hover:text-green-700 p-1"
                            aria-label="Edit bill"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Delete bill"
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
            
            {filteredBillingData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No bills found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'quotations' && (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search quotations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              <div className="ml-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Quotations Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Contact</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Service</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Est. Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Generated By</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map(quote => (
                  <tr key={quote.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{quote.date}</td>
                    <td className="px-4 py-3">{quote.customerName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{quote.customerContact}</td>
                    <td className="px-4 py-3">{quote.serviceType}</td>
                    <td className="px-4 py-3 font-medium">₹{quote.estimatedAmount}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{quote.generatedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {quote.status === 'pending' && (
                          <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                            <>
                              <button
                                className="text-green-500 hover:text-green-700 p-1"
                                aria-label="Approve quotation"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 p-1"
                                aria-label="Reject quotation"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          </RoleBasedAccess>
                        )}
                        <button
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="View quotation details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredQuotations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No quotations found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBillingManagement;
