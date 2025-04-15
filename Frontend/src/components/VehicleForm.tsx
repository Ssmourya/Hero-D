import React, { useState, useEffect } from 'react';
import { Vehicle } from '../services/vehicleService';

interface VehicleFormProps {
  onSubmit: (e: React.FormEvent, data: Vehicle) => void;
  initialData?: Vehicle | null;
  formType: 'create' | 'edit' | 'view' | 'delete';
  onClose?: () => void;
}

const defaultVehicle: Vehicle = {
  name: '',
  price: 0,
  description: '',
  image: '',
};

const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, initialData, formType, onClose }) => {
  const [formData, setFormData] = useState<Vehicle>(initialData || defaultVehicle);
  const isReadOnly = formType === 'view' || formType === 'delete';

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
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
          <p className="text-red-700">Are you sure you want to delete this vehicle?</p>
          <p className="font-semibold mt-2">{formData.name} - ₹{formData.price.toLocaleString()}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
              required
            />
          </div>

          {formData.image && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
              <img
                src={formData.image}
                alt={formData.name}
                className="w-full max-w-md h-auto rounded-md border border-gray-300"
              />
            </div>
          )}
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

export default VehicleForm;
