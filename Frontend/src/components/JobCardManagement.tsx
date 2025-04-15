import React from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface JobCard {
  id: string;
  customer: string;
  vehicle: string;
  serviceType: string;
  status: string;
  createdOn: string;
}

interface JobCardManagementProps {
  jobCardsData: JobCard[];
  openModal: (type: 'create' | 'edit' | 'view' | 'delete', title: string, item?: any) => void;
}

const JobCardManagement: React.FC<JobCardManagementProps> = ({ jobCardsData, openModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">Job Cards</h3>
        <button
          onClick={() => openModal('create', 'Create New Job Card')}
          className="bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-800 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" /> New Job Card
        </button>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {/* Desktop view */}
        <table className="w-full text-xs sm:text-sm hidden md:table">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Job Card #</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Customer</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Vehicle</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden xl:table-cell">Service Type</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Status</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 hidden lg:table-cell">Created On</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobCardsData.map(jobCard => (
              <tr key={`desktop-${jobCard.id}`} className="border-b hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-3">{jobCard.id}</td>
                <td className="px-2 sm:px-4 py-3">{jobCard.customer}</td>
                <td className="px-2 sm:px-4 py-3 hidden lg:table-cell">{jobCard.vehicle}</td>
                <td className="px-2 sm:px-4 py-3 hidden xl:table-cell">{jobCard.serviceType}</td>
                <td className="px-2 sm:px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    jobCard.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    jobCard.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>{jobCard.status}</span>
                </td>
                <td className="px-2 sm:px-4 py-3 hidden lg:table-cell">{jobCard.createdOn}</td>
                <td className="px-2 sm:px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('view', 'View Job Card', jobCard)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="View job card"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit', 'Edit Job Card', jobCard)}
                      className="text-green-500 hover:text-green-700 p-1"
                      aria-label="Edit job card"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('delete', 'Delete Job Card', jobCard)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Delete job card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {jobCardsData.map(jobCard => (
            <div key={`mobile-${jobCard.id}`} className="bg-white p-3 rounded shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs text-gray-500">Job Card #</span>
                  <p className="font-medium">{jobCard.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  jobCard.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  jobCard.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>{jobCard.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <span className="text-xs text-gray-500">Customer</span>
                  <p className="text-sm">{jobCard.customer}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Vehicle</span>
                  <p className="text-sm">{jobCard.vehicle}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Service Type</span>
                  <p className="text-sm">{jobCard.serviceType}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Created On</span>
                  <p className="text-sm">{jobCard.createdOn}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 border-t pt-2">
                <button
                  onClick={() => openModal('view', 'View Job Card', jobCard)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  aria-label="View job card"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal('edit', 'Edit Job Card', jobCard)}
                  className="text-green-500 hover:text-green-700 p-1"
                  aria-label="Edit job card"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal('delete', 'Delete Job Card', jobCard)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Delete job card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCardManagement;
