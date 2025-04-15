import React, { useState } from 'react';
import { BarChart3, PieChart, LineChart, Download, Calendar, FileText, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminReporting: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'services' | 'financial' | 'inventory' | 'employees'>('services');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access Reports.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reporting</h2>
        <p className="text-gray-600">Access detailed reports on services, financials, inventory, and employee performance</p>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin Reporting Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Access detailed reports on services, financials, stock, and employee performance</li>
            <li>Export reports in PDF or Excel format</li>
            <li>Filter reports by date range and other parameters</li>
          </ul>
        </div>
      </div>
      
      {/* Date Range Filter */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Calendar className="text-gray-500 w-5 h-5 mr-2" />
          <span className="text-gray-700 font-medium">Date Range:</span>
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${dateRange === 'today' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setDateRange('today')}
          >
            Today
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${dateRange === 'week' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setDateRange('week')}
          >
            This Week
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${dateRange === 'month' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setDateRange('month')}
          >
            This Month
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${dateRange === 'quarter' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setDateRange('quarter')}
          >
            This Quarter
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${dateRange === 'year' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setDateRange('year')}
          >
            This Year
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'services' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'financial' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'inventory' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'employees' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
      </div>
      
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Reports</h3>
            <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Services by Type</h4>
                <PieChart className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Service Type Distribution Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Most common service: <span className="font-medium">Oil Change (35%)</span></p>
                <p>Least common service: <span className="font-medium">Engine Repair (5%)</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Service Revenue Trend</h4>
                <LineChart className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Revenue Trend Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Total revenue: <span className="font-medium">₹68,500</span></p>
                <p>Growth from previous period: <span className="font-medium text-green-600">+12%</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Service Performance</h4>
                <BarChart3 className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Service Performance Chart</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Services</p>
                  <p className="font-medium text-lg">125</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg. Completion Time</p>
                  <p className="font-medium text-lg">45 mins</p>
                </div>
                <div>
                  <p className="text-gray-600">Customer Satisfaction</p>
                  <p className="font-medium text-lg">4.8/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Financial Reports</h3>
            <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Income vs Expenses</h4>
                <BarChart3 className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Income vs Expenses Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Total income: <span className="font-medium">₹85,500</span></p>
                <p>Total expenses: <span className="font-medium">₹32,200</span></p>
                <p>Net profit: <span className="font-medium text-green-600">₹53,300</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Revenue by Payment Method</h4>
                <PieChart className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Payment Method Distribution Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Cash: <span className="font-medium">₹71,440 (83.6%)</span></p>
                <p>Online: <span className="font-medium">₹8,115 (9.5%)</span></p>
                <p>Card: <span className="font-medium">₹5,945 (6.9%)</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Expense Breakdown</h4>
                <PieChart className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Expense Breakdown Chart</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Inventory</p>
                  <p className="font-medium text-lg">₹15,500</p>
                </div>
                <div>
                  <p className="text-gray-600">Labor</p>
                  <p className="font-medium text-lg">₹8,200</p>
                </div>
                <div>
                  <p className="text-gray-600">Utilities</p>
                  <p className="font-medium text-lg">₹4,800</p>
                </div>
                <div>
                  <p className="text-gray-600">Other</p>
                  <p className="font-medium text-lg">₹3,700</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Inventory Reports</h3>
            <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Stock Levels</h4>
                <BarChart3 className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Stock Levels Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Total items: <span className="font-medium">45</span></p>
                <p>Low stock items: <span className="font-medium text-amber-600">8</span></p>
                <p>Out of stock items: <span className="font-medium text-red-600">2</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Inventory Value</h4>
                <LineChart className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Inventory Value Trend Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Current value: <span className="font-medium">₹125,000</span></p>
                <p>Change from previous month: <span className="font-medium text-green-600">+5.2%</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Top Moving Items</h4>
                <BarChart3 className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Top Moving Items Chart</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Units Sold</th>
                      <th className="px-4 py-2 text-left">Revenue</th>
                      <th className="px-4 py-2 text-left">Current Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">Engine Oil (1L)</td>
                      <td className="px-4 py-2">Lubricants</td>
                      <td className="px-4 py-2">45</td>
                      <td className="px-4 py-2">₹20,250</td>
                      <td className="px-4 py-2">25</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Oil Filter</td>
                      <td className="px-4 py-2">Filters</td>
                      <td className="px-4 py-2">38</td>
                      <td className="px-4 py-2">₹4,560</td>
                      <td className="px-4 py-2">15</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Brake Pads (Pair)</td>
                      <td className="px-4 py-2">Brakes</td>
                      <td className="px-4 py-2">22</td>
                      <td className="px-4 py-2">₹13,200</td>
                      <td className="px-4 py-2">12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Employee Reports</h3>
            <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Attendance Rate</h4>
                <LineChart className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Attendance Rate Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Average attendance: <span className="font-medium">92%</span></p>
                <p>Best attendance: <span className="font-medium">Rajesh Kumar (98%)</span></p>
                <p>Needs improvement: <span className="font-medium">Vikram Patel (78%)</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Performance Ratings</h4>
                <BarChart3 className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Performance Ratings Chart</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Average rating: <span className="font-medium">4.2/5</span></p>
                <p>Top performer: <span className="font-medium">Priya Patel (5/5)</span></p>
                <p>Needs improvement: <span className="font-medium">Vikram Patel (2/5)</span></p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Productivity Metrics</h4>
                <BarChart3 className="text-gray-400 w-5 h-5" />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Productivity Metrics Chart</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Employee</th>
                      <th className="px-4 py-2 text-left">Position</th>
                      <th className="px-4 py-2 text-left">Services Completed</th>
                      <th className="px-4 py-2 text-left">Avg. Time per Service</th>
                      <th className="px-4 py-2 text-left">Customer Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">Rajesh Kumar</td>
                      <td className="px-4 py-2">Senior Mechanic</td>
                      <td className="px-4 py-2">42</td>
                      <td className="px-4 py-2">35 mins</td>
                      <td className="px-4 py-2">4.8/5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Sunil Sharma</td>
                      <td className="px-4 py-2">Mechanic</td>
                      <td className="px-4 py-2">38</td>
                      <td className="px-4 py-2">42 mins</td>
                      <td className="px-4 py-2">4.5/5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Vikram Patel</td>
                      <td className="px-4 py-2">Junior Mechanic</td>
                      <td className="px-4 py-2">22</td>
                      <td className="px-4 py-2">55 mins</td>
                      <td className="px-4 py-2">3.2/5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReporting;
