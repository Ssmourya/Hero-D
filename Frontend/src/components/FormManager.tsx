import React from 'react';
import LedgerForm from './LedgerForm';
import LedgerViewForm from './LedgerViewForm';
import UserForm from './UserForm';
import VehicleForm from './VehicleForm';
import WorkshopForm from './WorkshopForm';
import { LedgerEntry } from '../services/ledgerService';
import { User } from '../services/userService';
import { Vehicle } from '../services/vehicleService';
import { WorkshopEntry } from '../services/workshopService';

interface FormManagerProps {
  modalType: 'create' | 'edit' | 'view' | 'delete';
  modalTitle: string;
  currentItem: any;
  onSubmit: (e: React.FormEvent, data: any) => void;
  onClose: () => void;
}

const FormManager: React.FC<FormManagerProps> = ({
  modalType,
  modalTitle,
  currentItem,
  onSubmit,
  onClose
}) => {
  // Determine which form to render based on the modal title
  if (modalTitle.includes('Ledger') || modalTitle.includes('Entry')) {
    // For view operations, use the LedgerViewForm
    if (modalType === 'view') {
      return <LedgerViewForm
        data={currentItem as LedgerEntry}
        onClose={onClose}
      />;
    }

    // For other operations, use the regular LedgerForm
    return <LedgerForm
      onSubmit={onSubmit}
      initialData={currentItem as LedgerEntry}
      formType={modalType}
      onClose={onClose}
    />;
  } else if (modalTitle.includes('User')) {
    // Make sure we're not passing id to the form if it's a create operation
    let userData = currentItem as User;
    if (modalType === 'create') {
      // Create a new object without id or _id for new users
      userData = {
        name: '',
        role: 'Cashier',
        email: '',
        status: 'Active'
      };
    }

    return <UserForm
      onSubmit={onSubmit}
      initialData={userData}
      formType={modalType}
      onClose={onClose}
    />;
  } else if (modalTitle.includes('Vehicle')) {
    return <VehicleForm
      onSubmit={onSubmit}
      initialData={currentItem as Vehicle}
      formType={modalType}
      onClose={onClose}
    />;
  } else if (modalTitle.includes('Workshop') || modalTitle.includes('Service')) {
    return <WorkshopForm
      onSubmit={onSubmit}
      initialData={currentItem as WorkshopEntry}
      formType={modalType}
      onClose={onClose}
    />;
  }

  // Generic form for other types
  return (
    <div>
      <p>No form available for this type: {modalTitle}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FormManager;
