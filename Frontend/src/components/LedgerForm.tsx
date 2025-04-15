import React, { useState, useEffect } from 'react';
import { LedgerEntry } from '../services/ledgerService';

interface LedgerFormProps {
  onSubmit: (e: React.FormEvent, data: LedgerEntry) => void;
  initialData?: LedgerEntry | null;
  formType: 'create' | 'edit' | 'view' | 'delete';
  onClose?: () => void;
}

const defaultLedgerEntry: LedgerEntry = {
  date: new Date().toISOString().split('T')[0],
  customer: '',
  receiptNo: '',
  model: '',
  content: '',
  chassisNo: '',
  payment: '',
  cash: 0,
  iciciUpi: 0,
  hdfc: 0,
  total: 0,
  expenses: 0,
  sale: 0,
};

const LedgerForm: React.FC<LedgerFormProps> = ({ onSubmit, initialData, formType, onClose }) => {
  const [formData, setFormData] = useState<LedgerEntry>(initialData || defaultLedgerEntry);
  const isReadOnly = formType === 'view' || formType === 'delete';

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (['cash', 'iciciUpi', 'hdfc', 'total', 'expenses', 'sale'].includes(name)) {
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

  // Calculate total when cash, iciciUpi, or hdfc changes
  useEffect(() => {
    if (!isReadOnly) {
      const total = formData.cash + formData.iciciUpi + formData.hdfc;
      setFormData(prev => ({ ...prev, total }));
    }
  }, [formData.cash, formData.iciciUpi, formData.hdfc, isReadOnly]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formType === 'delete' ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-700">Are you sure you want to delete this ledger entry?</p>
          <p className="font-semibold mt-2">{formData.customer} - {formData.date}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Receipt No</label>
            <input
              type="text"
              name="receiptNo"
              value={formData.receiptNo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <input
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chassis No</label>
            <input
              type="text"
              name="chassisNo"
              value={formData.chassisNo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment</label>
            <input
              type="text"
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cash</label>
            <input
              type="number"
              name="cash"
              value={formData.cash}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ICICI UPI</label>
            <input
              type="number"
              name="iciciUpi"
              value={formData.iciciUpi}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">HDFC</label>
            <input
              type="number"
              name="hdfc"
              value={formData.hdfc}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expenses</label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sale</label>
            <input
              type="number"
              name="sale"
              value={formData.sale}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              readOnly={isReadOnly}
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

export default LedgerForm;
