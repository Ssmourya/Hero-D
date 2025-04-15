import React from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Vehicle } from '../services/vehicleService';

interface ShowroomManagementProps {
  vehiclesData: Vehicle[];
  openModal: (type: 'create' | 'edit' | 'view' | 'delete', title: string, item?: any) => void;
}

const ShowroomManagement: React.FC<ShowroomManagementProps> = ({ vehiclesData, openModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">Showroom Inventory</h3>
        <button
          onClick={() => openModal('create', 'Add New Vehicle')}
          className="bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-800 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {vehiclesData.map(vehicle => (
          <div key={vehicle.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md relative group border border-gray-100">
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100 sm:static sm:mb-2 sm:justify-end">
              <button
                onClick={() => openModal('view', 'View Vehicle', vehicle)}
                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                aria-label="View vehicle"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal('edit', 'Edit Vehicle', vehicle)}
                className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                aria-label="Edit vehicle"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal('delete', 'Delete Vehicle', vehicle)}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                aria-label="Delete vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 line-clamp-1">{vehicle.name}</h3>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-32 sm:h-40 md:h-48 object-cover rounded mb-3 md:mb-4"
              loading="lazy"
            />
            <p className="text-gray-600 mb-3 text-sm md:text-base line-clamp-2">{vehicle.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-red-700 text-sm md:text-base">₹{vehicle.price.toLocaleString()}</span>
              <button
                onClick={() => openModal('view', 'View Vehicle', vehicle)}
                className="bg-red-700 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-red-800 text-xs md:text-sm"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowroomManagement;
