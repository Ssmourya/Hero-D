import React from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { WorkshopEntry } from '../services/workshopService';

interface WorkshopManagementProps {
  workshopData: WorkshopEntry[];
  openModal: (type: 'create' | 'edit' | 'view' | 'delete', title: string, item?: any) => void;
}

const WorkshopManagement: React.FC<WorkshopManagementProps> = ({ workshopData, openModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">Workshop Management</h3>
        <button
          onClick={() => openModal('create', 'Add New Service')}
          className="bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-800 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Pending Services</h3>
          <div className="space-y-2 md:space-y-3">
            {workshopData.filter(service => service.status !== 'Completed').map(service => (
              <div key={service.id} className="p-2 md:p-3 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 group hover:bg-gray-50">
                <div className="w-full sm:w-auto">
                  <p className="font-medium text-sm md:text-base">{service.vehicle}</p>
                  <p className="text-xs md:text-sm text-gray-500">{service.service}</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    service.status === 'Waiting' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>{service.status}</span>
                  <div className="flex space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal('edit', 'Edit Service', service)}
                      className="text-green-500 hover:text-green-700 p-1"
                      aria-label="Edit service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('delete', 'Delete Service', service)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Completed Services</h3>
          <div className="space-y-2 md:space-y-3">
            {workshopData.filter(service => service.status === 'Completed').map(service => (
              <div key={service.id} className="p-2 md:p-3 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 group hover:bg-gray-50">
                <div className="w-full sm:w-auto">
                  <p className="font-medium text-sm md:text-base">{service.vehicle}</p>
                  <p className="text-xs md:text-sm text-gray-500">{service.service}</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{service.status}</span>
                  <div className="flex space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal('view', 'View Service', service)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="View service"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('delete', 'Delete Service', service)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopManagement;
