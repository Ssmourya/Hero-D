import React, { useState, useEffect } from 'react';
import { User } from '../services/userService';

interface UserFormProps {
  onSubmit: (e: React.FormEvent, data: User) => void;
  initialData?: User | null;
  formType: 'create' | 'edit' | 'view' | 'delete';
  onClose?: () => void;
}

const defaultUser: User = {
  name: '',
  role: 'Cashier',
  email: '',
  status: 'Active',
};

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData, formType, onClose }) => {
  const [formData, setFormData] = useState<User>(initialData || defaultUser);
  const isReadOnly = formType === 'view' || formType === 'delete';

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('UserForm - Submitting form data:', formData);
    // Validate form data
    if (!formData.name || !formData.email || !formData.role || !formData.status) {
      console.error('UserForm - Missing required fields:', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      });
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formType === 'delete' ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-700">Are you sure you want to delete this user?</p>
          <p className="font-semibold mt-2">{formData.name} - {formData.role}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              disabled={isReadOnly}
              required
            >
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="TELLYCALLER">TELLYCALLER</option>
              <option value="Storekeeper">Storekeeper</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              disabled={isReadOnly}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        {formType === 'view' ? (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                formType === 'delete'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-700 text-white hover:bg-red-800'
              }`}
            >
              {formType === 'create' ? 'Create' : formType === 'edit' ? 'Update' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default UserForm;
