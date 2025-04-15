import React, { useState, useEffect } from 'react';
import { Edit, Eye, Plus, Trash2, Search, Filter, DollarSign, CheckCircle, XCircle, Wrench, AlertTriangle, Settings, Tool } from 'lucide-react';
import RoleBasedAccess from './RoleBasedAccess';
import { useAuth } from '../context/AuthContext';

// Workshop service type interface
interface ServiceType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock service types
const mockServiceTypes: ServiceType[] = [
  { id: '1', name: 'Oil Change', description: 'Standard oil change service', basePrice: 500, duration: '30 mins', status: 'active', createdAt: '2023-01-15' },
  { id: '2', name: 'Joyride', description: 'Test ride service', basePrice: 200, duration: '15 mins', status: 'active', createdAt: '2023-02-10' },
  { id: '3', name: 'Engine Tuning', description: 'Engine performance optimization', basePrice: 1200, duration: '60 mins', status: 'active', createdAt: '2023-03-05' },
  { id: '4', name: 'Brake Service', description: 'Brake inspection and adjustment', basePrice: 800, duration: '45 mins', status: 'active', createdAt: '2023-03-20' },
  { id: '5', name: 'Full Service', description: 'Complete motorcycle service', basePrice: 2500, duration: '120 mins', status: 'active', createdAt: '2023-04-01' },
];

// Workshop service interface
interface WorkshopService {
  id: string;
  serviceTypeId: string;
  serviceTypeName: string;
  customerId: string;
  customerName: string;
  vehicleInfo: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  startDate: string;
  completionDate?: string;
  amount: number;
  notes?: string;
}

// Mock services data
const mockServices: WorkshopService[] = [
  { id: '1', serviceTypeId: '1', serviceTypeName: 'Oil Change', customerId: 'C1', customerName: 'Rajesh Kumar', vehicleInfo: 'Hero Splendor+', status: 'completed', assignedTo: 'Mechanic 1', startDate: '2023-04-10', completionDate: '2023-04-10', amount: 550, notes: 'Regular maintenance' },
  { id: '2', serviceTypeId: '3', serviceTypeName: 'Engine Tuning', customerId: 'C2', customerName: 'Sunil Sharma', vehicleInfo: 'Royal Enfield Classic 350', status: 'in-progress', assignedTo: 'Mechanic 2', startDate: '2023-04-11', amount: 1350, notes: 'Performance issues' },
  { id: '3', serviceTypeId: '5', serviceTypeName: 'Full Service', customerId: 'C3', customerName: 'Priya Patel', vehicleInfo: 'Honda Activa', status: 'pending', assignedTo: 'Mechanic 1', startDate: '2023-04-12', amount: 2700, notes: 'Annual service' },
  { id: '4', serviceTypeId: '2', serviceTypeName: 'Joyride', customerId: 'C4', customerName: 'Amit Singh', vehicleInfo: 'Yamaha FZ', status: 'completed', assignedTo: 'Mechanic 3', startDate: '2023-04-10', completionDate: '2023-04-10', amount: 200, notes: 'Test ride after repair' },
  { id: '5', serviceTypeId: '4', serviceTypeName: 'Brake Service', customerId: 'C5', customerName: 'Neha Gupta', vehicleInfo: 'TVS Jupiter', status: 'completed', assignedTo: 'Mechanic 2', startDate: '2023-04-09', completionDate: '2023-04-09', amount: 850, notes: 'Brake pad replacement' },
];

// Expense item interface
interface ExpenseItem {
  id: string;
  serviceId: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const mockExpenses: ExpenseItem[] = [
  { id: '1', serviceId: '1', description: 'Engine Oil', amount: 350, status: 'approved', date: '2023-04-10' },
  { id: '2', serviceId: '1', description: 'Oil Filter', amount: 150, status: 'approved', date: '2023-04-10' },
  { id: '3', serviceId: '3', description: 'Spark Plugs', amount: 400, status: 'pending', date: '2023-04-11' },
  { id: '4', serviceId: '4', description: 'Brake Pads', amount: 600, status: 'pending', date: '2023-04-12' },
  { id: '5', serviceId: '5', description: 'Labor Charges', amount: 800, status: 'rejected', date: '2023-04-09' },
];

const AdminWorkshopManagement: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'services' | 'serviceTypes' | 'expenses'>('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showAddServiceTypeModal, setShowAddServiceTypeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

  // Form state for adding service types
  const [serviceTypeForm, setServiceTypeForm] = useState({
    name: '',
    description: '',
    basePrice: 0,
    duration: ''
  });

  // Form state for adding expenses
  const [expenseForm, setExpenseForm] = useState({
    serviceId: '',
    description: '',
    amount: 0,
    category: 'parts',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculate total services and revenue
  const totalServices = mockServices.length;
  const totalRevenue = mockServices.reduce((sum, service) => sum + service.amount, 0);

  // Filter services based on search term and status filter
  const filteredServices = mockServices.filter(service => {
    const matchesSearch =
      service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceTypeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? service.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Filter service types based on search term
  const filteredServiceTypes = mockServiceTypes.filter(type => {
    return type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           type.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter expenses based on search term and status filter
  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? expense.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Handle adding a new service type
  const handleAddServiceType = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would call an API to add the service type
    alert(`New service type added: ${serviceTypeForm.name}`);

    // Reset form and close modal
    setServiceTypeForm({
      name: '',
      description: '',
      basePrice: 0,
      duration: ''
    });
    setShowAddServiceTypeModal(false);
  };

  // Handle service type form input changes
  const handleServiceTypeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceTypeForm({
      ...serviceTypeForm,
      [name]: name === 'basePrice' ? parseFloat(value) || 0 : value
    });
  };

  // Handle adding a new expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would call an API to add the expense
    alert(`New expense added: ${expenseForm.description} - ₹${expenseForm.amount}`);

    // Reset form and close modal
    setExpenseForm({
      serviceId: '',
      description: '',
      amount: 0,
      category: 'parts',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpenseModal(false);
  };

  // Handle expense form input changes
  const handleExpenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpenseForm({
      ...expenseForm,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };

  // Handle expense approval/rejection
  const handleExpenseAction = (expenseId: string, action: 'approve' | 'reject') => {
    // In a real app, this would call an API to approve/reject the expense
    alert(`Expense ${expenseId} ${action === 'approve' ? 'approved' : 'rejected'}`);
  };

  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access Workshop Management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Workshop Management</h2>
        <p className="text-gray-600">Manage services, service types, and expenses</p>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin Workshop Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Add new service types (e.g., oil change, joyride)</li>
            <li>Monitor total services (e.g., {totalServices} services) and revenue (e.g., ₹{totalRevenue})</li>
            <li>Approve or reject service-related expenses (e.g., oil, labor, parts)</li>
          </ul>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Wrench className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Total Services</p>
            <p className="text-2xl font-bold text-blue-800">{totalServices}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <DollarSign className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-green-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-800">₹{totalRevenue}</p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-amber-100 rounded-full mr-4">
            <Filter className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-amber-600">Pending Expenses</p>
            <p className="text-2xl font-bold text-amber-800">
              {mockExpenses.filter(exp => exp.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'services' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('services')}
        >
          <div className="flex items-center">
            <Wrench className="w-4 h-4 mr-1" />
            <span>Services</span>
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'serviceTypes' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('serviceTypes')}
        >
          <div className="flex items-center">
            <Settings className="w-4 h-4 mr-1" />
            <span>Service Types</span>
            <span className="ml-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">{mockServiceTypes.length}</span>
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'expenses' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('expenses')}
        >
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>Expenses</span>
            <span className="ml-1 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">{mockExpenses.filter(exp => exp.status === 'pending').length}</span>
          </div>
        </button>
      </div>

      {activeTab === 'services' && (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search services..."
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
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <RoleBasedAccess allowedRoles={['Admin', 'Owner', 'Manager']}>
              <button
                onClick={() => alert('Add new service functionality would go here')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors w-full md:w-auto justify-center md:justify-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </RoleBasedAccess>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Vehicle</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Service</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Cost</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(service => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{service.vehicleInfo}</td>
                    <td className="px-4 py-3">{service.customerName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{service.serviceTypeName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.status === 'completed' ? 'bg-green-100 text-green-800' :
                        service.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        service.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">₹{service.amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`View service details for: ${service.id}`)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="View service"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner', 'Manager']}>
                          <button
                            onClick={() => alert(`Edit service: ${service.id}`)}
                            className="text-green-500 hover:text-green-700 p-1"
                            aria-label="Edit service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            onClick={() => alert(`Delete service: ${service.id}`)}
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Delete service"
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

            {filteredServices.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No services found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'serviceTypes' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Types</h3>
            <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
              <button
                onClick={() => setShowAddServiceTypeModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service Type</span>
              </button>
            </RoleBasedAccess>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockServiceTypes.map(serviceType => (
              <div key={serviceType.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{serviceType.name}</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    ₹{serviceType.basePrice}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{serviceType.description}</p>
                <p className="text-xs text-gray-500">Duration: {serviceType.duration}</p>

                <div className="mt-4 flex justify-end space-x-2">
                  <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  </RoleBasedAccess>
                  <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </RoleBasedAccess>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'expenses' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Expenses</h3>
            <RoleBasedAccess allowedRoles={['Admin', 'Owner', 'Manager']}>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </RoleBasedAccess>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Description</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockExpenses.map(expense => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{expense.description}</td>
                    <td className="px-4 py-3">₹{expense.amount}</td>
                    <td className="px-4 py-3">{expense.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                        expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {expense.status === 'pending' && (
                          <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                            <>
                              <button
                                className="text-green-500 hover:text-green-700 p-1"
                                aria-label="Approve expense"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 p-1"
                                aria-label="Reject expense"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          </RoleBasedAccess>
                        )}
                        <button
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="View expense details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Service Type Modal */}
      {showAddServiceTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Service Type</h3>
              <button
                onClick={() => setShowAddServiceTypeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddServiceType} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={serviceTypeForm.name}
                  onChange={handleServiceTypeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={serviceTypeForm.description}
                  onChange={handleServiceTypeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={serviceTypeForm.basePrice}
                  onChange={handleServiceTypeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 30 mins)</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={serviceTypeForm.duration}
                  onChange={handleServiceTypeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddServiceTypeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Add Service Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Expense</h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">Related Service</label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={expenseForm.serviceId}
                  onChange={handleExpenseInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select a service</option>
                  {mockServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.serviceTypeName} - {service.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={expenseForm.description}
                  onChange={handleExpenseInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={expenseForm.amount}
                  onChange={handleExpenseInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={expenseForm.category}
                  onChange={handleExpenseInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="parts">Parts</option>
                  <option value="labor">Labor</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={expenseForm.date}
                  onChange={handleExpenseInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkshopManagement;
