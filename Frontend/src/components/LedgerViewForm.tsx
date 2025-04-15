import React from 'react';
import { LedgerEntry } from '../services/ledgerService';

interface LedgerViewFormProps {
  data: LedgerEntry;
  onClose: () => void;
}

const LedgerViewForm: React.FC<LedgerViewFormProps> = ({ data, onClose }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.date || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.customer || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Receipt No</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.receiptNo || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.model || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.content || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Chassis No</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.chassisNo || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.payment || 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cash</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.cash > 0 ? `₹${data.cash.toLocaleString()}` : '₹0'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">ICICI UPI</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.iciciUpi > 0 ? `₹${data.iciciUpi.toLocaleString()}` : '₹0'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">HDFC</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.hdfc > 0 ? `₹${data.hdfc.toLocaleString()}` : '₹0'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md font-semibold">
            {data.total > 0 ? `₹${data.total.toLocaleString()}` : '₹0'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Expenses</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
            {data.expenses > 0 ? `₹${data.expenses.toLocaleString()}` : '₹0'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Sale</label>
          <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md font-semibold">
            {data.sale > 0 ? `₹${data.sale.toLocaleString()}` : '₹0'}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LedgerViewForm;
