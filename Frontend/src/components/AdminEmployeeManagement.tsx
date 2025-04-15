import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash2, Calendar, BarChart2, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleBasedAccess from './RoleBasedAccess';

// Mock employee data
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  joinDate: string;
  contact: string;
  status: 'active' | 'inactive' | 'on-leave';
  performance: number; // 1-5 rating
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Rajesh Kumar', position: 'Senior Mechanic', department: 'Workshop', joinDate: '2020-05-15', contact: '9876543210', status: 'active', performance: 4 },
  { id: '2', name: 'Sunil Sharma', position: 'Mechanic', department: 'Workshop', joinDate: '2021-02-10', contact: '8765432109', status: 'active', performance: 3 },
  { id: '3', name: 'Priya Patel', position: 'Cashier', department: 'Finance', joinDate: '2021-06-22', contact: '7654321098', status: 'active', performance: 5 },
  { id: '4', name: 'Amit Singh', position: 'Sales Executive', department: 'Sales', joinDate: '2022-01-05', contact: '6543210987', status: 'on-leave', performance: 4 },
  { id: '5', name: 'Neha Gupta', position: 'Receptionist', department: 'Admin', joinDate: '2022-03-15', contact: '5432109876', status: 'active', performance: 4 },
  { id: '6', name: 'Vikram Patel', position: 'Junior Mechanic', department: 'Workshop', joinDate: '2022-07-10', contact: '4321098765', status: 'inactive', performance: 2 },
];

// Mock schedule data
interface ScheduleEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: 'morning' | 'evening' | 'night';
  status: 'scheduled' | 'completed' | 'absent';
}

const mockSchedules: ScheduleEntry[] = [
  { id: '1', employeeId: '1', employeeName: 'Rajesh Kumar', date: '2023-04-12', shift: 'morning', status: 'completed' },
  { id: '2', employeeId: '2', employeeName: 'Sunil Sharma', date: '2023-04-12', shift: 'evening', status: 'completed' },
  { id: '3', employeeId: '3', employeeName: 'Priya Patel', date: '2023-04-12', shift: 'morning', status: 'completed' },
  { id: '4', employeeId: '4', employeeName: 'Amit Singh', date: '2023-04-12', shift: 'morning', status: 'absent' },
  { id: '5', employeeId: '1', employeeName: 'Rajesh Kumar', date: '2023-04-13', shift: 'morning', status: 'scheduled' },
  { id: '6', employeeId: '2', employeeName: 'Sunil Sharma', date: '2023-04-13', shift: 'evening', status: 'scheduled' },
];

const AdminEmployeeManagement: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'employees' | 'schedules' | 'performance'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Filter employees based on search term, department, and status
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.contact.includes(searchTerm);
    
    const matchesDepartment = departmentFilter ? employee.department === departmentFilter : true;
    const matchesStatus = statusFilter ? employee.status === statusFilter : true;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // Get unique departments for filter
  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

  // Only Admin and Owner should access this component
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to access Employee Management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Employee Management</h2>
        <p className="text-gray-600">Manage workshop employees, schedules, and performance</p>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Admin Employee Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Add, update, or remove workshop employee details</li>
            <li>Assign schedules and track performance</li>
            <li>Monitor attendance and productivity</li>
          </ul>
        </div>
      </div>
      
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Users className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Total Employees</p>
            <p className="text-2xl font-bold text-blue-800">{mockEmployees.length}</p>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <UserCheck className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-green-600">Active Employees</p>
            <p className="text-2xl font-bold text-green-800">{mockEmployees.filter(emp => emp.status === 'active').length}</p>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full mr-4">
            <Clock className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-purple-600">Scheduled Today</p>
            <p className="text-2xl font-bold text-purple-900">{mockSchedules.filter(sch => sch.date === '2023-04-13').length}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'employees' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'schedules' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('schedules')}
        >
          Schedules
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'performance' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>
      
      {activeTab === 'employees' && (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              <div className="ml-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="ml-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
            </div>
            
            <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors w-full md:w-auto justify-center md:justify-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </RoleBasedAccess>
          </div>
          
          {/* Employees Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Position</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Department</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Join Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 hidden md:table-cell">Contact</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{employee.name}</td>
                    <td className="px-4 py-3">{employee.position}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{employee.department}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{employee.joinDate}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{employee.contact}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' :
                        employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1"
                            aria-label="Edit employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Delete employee"
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
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No employees found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'schedules' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Employee Schedules</h3>
            <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Assign Schedule</span>
              </button>
            </RoleBasedAccess>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Employee</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Shift</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSchedules.map(schedule => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{schedule.date}</td>
                    <td className="px-4 py-3 font-medium">{schedule.employeeName}</td>
                    <td className="px-4 py-3 capitalize">{schedule.shift}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                        schedule.status === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1"
                            aria-label="Edit schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {activeTab === 'performance' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Employee Performance</h3>
            <button className="border border-gray-300 rounded-lg px-3 py-2 flex items-center space-x-1 text-gray-700">
              <BarChart2 className="w-4 h-4" />
              <span>Performance Report</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEmployees.map(employee => (
              <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    employee.status === 'active' ? 'bg-green-100 text-green-800' :
                    employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Performance Rating</span>
                    <span className="text-sm font-medium text-gray-700">{employee.performance}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        employee.performance >= 4 ? 'bg-green-600' :
                        employee.performance >= 3 ? 'bg-blue-600' :
                        'bg-amber-600'
                      }`} 
                      style={{ width: `${(employee.performance / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <RoleBasedAccess allowedRoles={['Admin', 'Owner']}>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Update Rating</button>
                  </RoleBasedAccess>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEmployeeManagement;
