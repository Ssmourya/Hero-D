import React from 'react';
import { Plus } from 'lucide-react';

interface GenericContentProps {
  title: string;
  openModal: (type: 'create' | 'edit' | 'view' | 'delete', title: string, item?: any) => void;
}

const GenericContent: React.FC<GenericContentProps> = ({ title, openModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => openModal('create', `Add New ${title} Item`)}
          className="bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-800 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      </div>
      <p className="text-gray-600 mb-4 text-sm md:text-base">This is the {title.toLowerCase()} section of the application. Content for this section is under development.</p>
      <div className="p-3 md:p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-xs md:text-sm text-gray-500">Coming soon: Detailed {title.toLowerCase()} management features with full CRUD operations.</p>
      </div>
    </div>
  );
};

export default GenericContent;
