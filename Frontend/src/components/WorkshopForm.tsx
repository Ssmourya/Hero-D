import React, { useState, useEffect } from 'react';
import { WorkshopEntry } from '../services/workshopService';

interface WorkshopFormProps {
  onSubmit: (e: React.FormEvent, data: WorkshopEntry) => void;
  initialData?: WorkshopEntry | null;
  formType: 'create' | 'edit' | 'view' | 'delete';
  onClose?: () => void;
}

const defaultWorkshopEntry: WorkshopEntry = {
  vehicle: '',
  customer: '',
  service: '',
  status: 'Pending',
  date: new Date().toISOString().split('T')[0],
  estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
  cost: 0,
};

const WorkshopForm: React.FC<WorkshopFormProps> = ({ onSubmit, initialData, formType, onClose }) => {
  const [formData, setFormData] = useState<WorkshopEntry>(initialData || defaultWorkshopEntry);
  const isReadOnly = formType === 'view' || formType === 'delete';

  useEffect(() => {
    if (initialData) {
      // Format dates if they are Date objects
      const formattedData = {
        ...initialData,
        date: initialData.date instanceof Date
          ? initialData.date.toISOString().split('T')[0]
          : typeof initialData.date === 'string' && initialData.date.includes('T')
            ? initialData.date.split('T')[0]
            : initialData.date,
        estimatedCompletion: initialData.estimatedCompletion instanceof Date
          ? initialData.estimatedCompletion.toISOString().split('T')[0]
          : typeof initialData.estimatedCompletion === 'string' && initialData.estimatedCompletion.includes('T')
            ? initialData.estimatedCompletion.split('T')[0]
            : initialData.estimatedCompletion,
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'cost') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formType === 'delete' ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-700">Are you sure you want to delete this workshop entry?</p>
          <p className="font-semibold mt-2">{formData.vehicle} - {formData.service}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <input
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <textarea
              name="service"
              value={formData.service}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={typeof formData.date === 'string' ? formData.date : formData.date.toISOString().split('T')[0]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Completion</label>
            <input
              type="date"
              name="estimatedCompletion"
              value={typeof formData.estimatedCompletion === 'string' ? formData.estimatedCompletion : formData.estimatedCompletion.toISOString().split('T')[0]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
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

export default WorkshopForm;
