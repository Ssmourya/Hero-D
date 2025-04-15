import React, { useState, useEffect, useRef } from 'react';
import { LedgerEntry, ledgerService } from '../services/ledgerService';
import { Edit, Save, X, Plus, Trash2, RefreshCw, FileSpreadsheet } from 'lucide-react';

const DailyLedger: React.FC = () => {
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([
    {
      _id: '1',
      date: '24-09-25',
      customer: 'RAMESH 29-9-25',
      receiptNo: '',
      model: 'SPL+',
      content: 'BIKE SALE',
      chassisNo: '402 CHASSIS 9-26',
      payment: '86500',
      cash: 30000,
      iciciUpi: 24500,
      hdfc: 0,
      total: 54500,
      remaining: 32000,
      expenses: 0,
      sale: 86500,
      name: 'SOKAT',
      typeOfExpense: 'N BIKE PETROL',
      amount: 200,
      balance: 240000,
      bikeCarada: 0,
      bikeCaradaOut: 0,
      bikeTheft: 0,
      openingBalance: 213155,
      bikeStock: 213155,
      closingBalance: 112120
    },
    {
      _id: '2',
      date: '23-9-3',
      customer: 'RASHID 23-3',
      receiptNo: '11991',
      model: 'SPL+',
      content: 'BIKE SALE',
      chassisNo: '11295 CHASSIS 9-26',
      payment: '88000',
      cash: 0,
      iciciUpi: 18000,
      hdfc: 0,
      total: 18000,
      remaining: 70000,
      expenses: 0,
      sale: 88000,
      name: 'KULLA',
      typeOfExpense: 'N BIKE PETROL',
      amount: 100,
      balance: 242955,
      bikeCarada: 0,
      bikeCaradaOut: 0,
      bikeTheft: 0,
      openingBalance: 213155,
      bikeStock: 213155,
      closingBalance: 112120
    }
  ]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch data from the API
      const data = await ledgerService.getAllLedgerEntries();

      if (data && data.length > 0) {
        setLedgerData(data);
      } else {
        // If no data is returned, keep the sample data for demonstration
        console.log('No data returned from API, using sample data');
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching ledger data:', err);
      setError('Failed to load ledger data: ' + (err as Error).message);
      // Keep the sample data on error for demonstration
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate totals for the summary row
  const calculateTotals = () => {
    // Default values
    const defaultTotals = {
      openingBalance: 213155,
      cash: 112120,
      iciciUpi: 136209,
      hdfc: 0,
      total: 240000,
      remaining: 0,
      expenses: 2105,
      sale: 9,
      bikeStock: 213155,
      bikeCarada: 0,
      bikeCaradaOut: 0,
      bikeTheft: 0,
      closingBalance: 112120,
      amount: 0,
      balance: 0,
    };

    // If no data, return default values
    if (ledgerData.length === 0) {
      return defaultTotals;
    }

    return ledgerData.reduce(
      (acc, entry) => {
        return {
          openingBalance: entry.openingBalance || acc.openingBalance,
          cash: acc.cash + (entry.cash || 0),
          iciciUpi: acc.iciciUpi + (entry.iciciUpi || 0),
          hdfc: acc.hdfc + (entry.hdfc || 0),
          total: acc.total + (entry.total || 0),
          remaining: acc.remaining + (entry.remaining || 0),
          expenses: acc.expenses + (entry.expenses || 0),
          sale: acc.sale + (entry.sale || 0),
          bikeStock: entry.bikeStock || acc.bikeStock,
          bikeCarada: acc.bikeCarada + (entry.bikeCarada || 0),
          bikeCaradaOut: acc.bikeCaradaOut + (entry.bikeCaradaOut || 0),
          bikeTheft: acc.bikeTheft + (entry.bikeTheft || 0),
          closingBalance: entry.closingBalance || acc.closingBalance,
          amount: acc.amount + (entry.amount || 0),
          balance: entry.balance || acc.balance,
        };
      },
      defaultTotals
    );
  };

  const totals = calculateTotals();

  // Handle cell edit
  const handleCellEdit = (rowIndex: number, field: keyof LedgerEntry, value: any) => {
    const updatedData = [...ledgerData];
    const row = { ...updatedData[rowIndex] };

    // Handle each field type appropriately
    switch (field) {
      case 'cash':
      case 'iciciUpi':
      case 'hdfc':
      case 'total':
      case 'remaining':
      case 'expenses':
      case 'sale':
      case 'amount':
      case 'balance':
      case 'bikeCarada':
      case 'bikeCaradaOut':
      case 'bikeTheft':
      case 'openingBalance':
      case 'bikeStock':
      case 'closingBalance':
        row[field] = parseFloat(value) || 0;
        break;
      default:
        row[field] = value;
    }

    // Recalculate total if payment fields change
    if (field === 'cash' || field === 'iciciUpi' || field === 'hdfc') {
      row.total = (row.cash || 0) + (row.iciciUpi || 0) + (row.hdfc || 0);

      // Calculate remaining if payment and total are set
      if (row.payment && !isNaN(parseFloat(row.payment))) {
        const paymentValue = parseFloat(row.payment);
        row.remaining = paymentValue - row.total;
      }
    }

    // Update remaining if payment changes
    if (field === 'payment' && typeof value === 'string' && !isNaN(parseFloat(value))) {
      const paymentValue = parseFloat(value);
      row.remaining = paymentValue - (row.total || 0);
    }

    updatedData[rowIndex] = row;
    setLedgerData(updatedData);
  };

  // Start editing a cell
  const startEditing = (rowIndex: number, field: string) => {
    setEditingCell({ row: rowIndex, col: field });
  };

  // Start editing an entire row
  const startRowEditing = (rowIndex: number) => {
    setEditingRow(rowIndex);
    // We don't set a specific cell for editing initially
    // This allows the user to click on any cell they want to edit
    setEditingCell(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCell(null);
    setEditingRow(null);
    // Refresh data to revert any unsaved changes
    fetchData();
  };

  // Save changes to the database
  const saveChanges = async (rowIndex: number) => {
    try {
      setLoading(true);
      const entry = ledgerData[rowIndex];

      // Calculate total if it's not already set
      if ((entry.cash || 0) + (entry.iciciUpi || 0) + (entry.hdfc || 0) !== entry.total) {
        entry.total = (entry.cash || 0) + (entry.iciciUpi || 0) + (entry.hdfc || 0);
      }

      // Calculate remaining if payment is set
      if (entry.payment && !isNaN(parseFloat(entry.payment))) {
        const paymentValue = parseFloat(entry.payment);
        entry.remaining = paymentValue - entry.total;
      }

      if (entry._id) {
        // Update existing entry
        const updatedEntry = await ledgerService.updateLedgerEntry(entry._id, entry);
        const updatedData = [...ledgerData];
        updatedData[rowIndex] = updatedEntry;
        setLedgerData(updatedData);
      } else {
        // Create new entry
        const newEntry = await ledgerService.createLedgerEntry(entry);
        const updatedData = [...ledgerData];
        updatedData[rowIndex] = newEntry;
        setLedgerData(updatedData);
      }
      setEditingCell(null);
      setEditingRow(null);
      setError(null);
    } catch (err) {
      console.error('Error saving ledger entry:', err);
      setError('Failed to save changes: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new row
  const addNewRow = async () => {
    // Format current date as DD-MM-YY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    const formattedDate = `${day}-${month}-${year}`;

    // Get the last row's balance as the new balance
    const lastBalance = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance || 0 : 0;
    const lastOpeningBalance = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].openingBalance || 213155 : 213155;

    const newEntry: LedgerEntry = {
      date: formattedDate,
      customer: '',
      receiptNo: '',
      model: '',
      content: '',
      chassisNo: '',
      payment: '0',
      cash: 0,
      iciciUpi: 0,
      hdfc: 0,
      total: 0,
      remaining: 0,
      expenses: 0,
      sale: 0,
      name: '',
      typeOfExpense: '',
      amount: 0,
      balance: lastBalance,
      bikeCarada: 0,
      bikeCaradaOut: 0,
      bikeTheft: 0,
      openingBalance: lastOpeningBalance,
      bikeStock: 0,
      closingBalance: lastBalance
    };

    try {
      // Create the new entry in the database
      const createdEntry = await ledgerService.createLedgerEntry(newEntry);
      setLedgerData([...ledgerData, createdEntry]);

      // Start editing the customer field of the new row
      setTimeout(() => {
        startRowEditing(ledgerData.length);
      }, 100);

      setError(null);
    } catch (err) {
      console.error('Error creating new entry:', err);
      setError('Failed to create new entry: ' + (err as Error).message);

      // Add the entry locally if API call fails
      setLedgerData([...ledgerData, newEntry]);
      setTimeout(() => {
        startRowEditing(ledgerData.length);
      }, 100);
    }
  };

  // Handle Excel import
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process the imported Excel file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Here you would typically use a library like xlsx or exceljs to parse the Excel file
    // For now, we'll just show a message that the functionality is ready to be implemented
    setError('Excel import functionality is ready to be implemented. The table structure has been updated to match the provided image.');

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete a row
  const deleteRow = async (rowIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      setLoading(true);
      const entry = ledgerData[rowIndex];

      if (entry._id) {
        await ledgerService.deleteLedgerEntry(entry._id);
      }

      const updatedData = [...ledgerData];
      updatedData.splice(rowIndex, 1);
      setLedgerData(updatedData);
      setError(null);
    } catch (err) {
      console.error('Error deleting ledger entry:', err);
      setError('Failed to delete entry: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Render an editable cell
  const renderEditableCell = (entry: LedgerEntry, rowIndex: number, field: keyof LedgerEntry) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === field;
    const isRowEditing = editingRow === rowIndex;
    const value = entry[field];
    const numericFields = ['cash', 'iciciUpi', 'hdfc', 'total', 'remaining', 'expenses', 'sale', 'amount', 'balance', 'bikeCarada', 'bikeCaradaOut', 'bikeTheft', 'openingBalance', 'bikeStock', 'closingBalance'];

    // If this cell is being edited
    if (isEditing) {
      return (
        <input
          className={`w-full px-1 py-1 border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center ${
            field === 'date' || field === 'customer' || field === 'receiptNo' || field === 'model' ||
            field === 'content' || field === 'chassisNo' || field === 'payment'
              ? 'bg-blue-50'
              : field === 'cash'
                ? 'bg-green-50'
                : field === 'iciciUpi' || field === 'hdfc'
                  ? 'bg-orange-50'
                  : field === 'total' || field === 'remaining'
                    ? 'bg-blue-50'
                    : field === 'name' || field === 'typeOfExpense' || field === 'amount' || field === 'balance'
                      ? 'bg-gray-100'
                      : field === 'bikeCarada' || field === 'bikeCaradaOut' || field === 'bikeTheft'
                        ? 'bg-yellow-50'
                        : field === 'openingBalance' || field === 'bikeStock'
                          ? 'bg-yellow-100'
                          : ''
          }`}
          type={numericFields.includes(field) ? 'number' : 'text'}
          value={value === 0 && numericFields.includes(field) ? '' : value}
          onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
          onBlur={() => {
            // Don't do anything on blur if we're in row editing mode
            // This allows clicking on other cells in the same row
            if (!isRowEditing) {
              setEditingCell(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Save changes when Enter is pressed
              saveChanges(rowIndex);
            } else if (e.key === 'Escape') {
              // Cancel editing when Escape is pressed
              cancelEditing();
            } else if (e.key === 'Tab') {
              // Handle tab navigation manually for better control
              e.preventDefault();
              const fields: (keyof LedgerEntry)[] = [
                'date', 'customer', 'receiptNo', 'model', 'content', 'chassisNo', 'payment',
                'cash', 'iciciUpi', 'hdfc', 'total', 'remaining', 'name', 'typeOfExpense', 'amount', 'balance',
                'bikeCarada', 'bikeCaradaOut', 'bikeTheft', 'openingBalance', 'bikeStock'
              ];
              const currentIndex = fields.indexOf(field);
              if (e.shiftKey) {
                // Move to previous field
                if (currentIndex > 0) {
                  startEditing(rowIndex, fields[currentIndex - 1]);
                }
              } else {
                // Move to next field
                if (currentIndex < fields.length - 1) {
                  startEditing(rowIndex, fields[currentIndex + 1]);
                } else {
                  // If at the last field, save changes
                  saveChanges(rowIndex);
                }
              }
            }
          }}
          autoFocus
        />
      );
    }

    // When in row editing mode, make all cells clickable and show visual cues
    if (isRowEditing) {
      // Format numbers with commas
      if (numericFields.includes(field) && typeof value === 'number') {
        return (
          <div
            onClick={() => startEditing(rowIndex, field)}
            className="p-1 min-h-[24px] cursor-pointer hover:bg-blue-100 rounded flex items-center justify-center group relative"
            title="Click to edit"
          >
            <span>{value > 0 ? value.toLocaleString() : ''}</span>
            <Edit className="w-3 h-3 ml-1 text-blue-500 opacity-0 group-hover:opacity-100 absolute right-1" />
          </div>
        );
      }

      return (
        <div
          onClick={() => startEditing(rowIndex, field)}
          className="p-1 min-h-[24px] cursor-pointer hover:bg-blue-100 rounded flex items-center justify-center group relative"
          title="Click to edit"
        >
          <span>{value || ''}</span>
          <Edit className="w-3 h-3 ml-1 text-blue-500 opacity-0 group-hover:opacity-100 absolute right-1" />
        </div>
      );
    }

    // Normal display mode (not editing)
    // Format numbers with commas
    if (numericFields.includes(field) && typeof value === 'number') {
      return (
        <div className="p-1 min-h-[24px]">
          {value > 0 ? value.toLocaleString() : ''}
        </div>
      );
    }

    return (
      <div className="p-1 min-h-[24px]">
        {value || ''}
      </div>
    );
  };

  // Loading overlay
  const renderLoadingOverlay = () => {
    if (!loading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-700"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  };

  // Error message
  const renderErrorMessage = () => {
    if (!error) return null;

    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
        <div className="flex items-center">
          <div className="py-1">
            <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
        <div className="mt-2 text-right">
          <button
            onClick={() => setError(null)}
            className="text-sm text-red-700 hover:text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  };

  // Add this function to calculate card totals
  const calculateCardTotals = () => {
    return ledgerData.reduce((acc, entry) => ({
      totalSales: acc.totalSales + (entry.sale || 0),
      totalExpenses: acc.totalExpenses + (entry.expenses || 0),
      totalCash: acc.totalCash + (entry.cash || 0),
      totalUPI: acc.totalUPI + (entry.iciciUpi || 0),
      totalHDFC: acc.totalHDFC + (entry.hdfc || 0),
      totalBalance: acc.totalBalance + (entry.balance || 0),
      totalBikeStock: acc.totalBikeStock + (entry.bikeStock || 0),
      totalClosingBalance: acc.totalClosingBalance + (entry.closingBalance || 0),
    }), {
      totalSales: 0,
      totalExpenses: 0,
      totalCash: 0,
      totalUPI: 0,
      totalHDFC: 0,
      totalBalance: 0,
      totalBikeStock: 0,
      totalClosingBalance: 0,
    });
  };

  // Add the cards section before the table
  const renderSummaryCards = () => {
    const cardTotals = calculateCardTotals();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sales Summary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-xl font-bold text-green-600">₹{cardTotals.totalSales.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">₹{cardTotals.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Methods</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-sm text-gray-500">Cash</p>
              <p className="text-xl font-bold text-blue-600">₹{cardTotals.totalCash.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ICICI UPI</p>
              <p className="text-xl font-bold text-purple-600">₹{cardTotals.totalUPI.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">HDFC UPI</p>
              <p className="text-xl font-bold text-orange-600">₹{cardTotals.totalHDFC.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Balance Summary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-xl font-bold text-indigo-600">₹{cardTotals.totalBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Closing Balance</p>
              <p className="text-xl font-bold text-teal-600">₹{cardTotals.totalClosingBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Inventory</h3>
          <div>
            <p className="text-sm text-gray-500">Bike Stock</p>
            <p className="text-xl font-bold text-yellow-600">{cardTotals.totalBikeStock.toLocaleString()} units</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2  relative">
      {renderLoadingOverlay()}
      {renderErrorMessage()}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Daily Ledger</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleImportClick}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Import Excel
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={addNewRow}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {renderSummaryCards()}

      {/* Ledger Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full max-w-full border-collapse border border-gray-300 text-sm table-fixed whitespace-nowrap" style={{ borderSpacing: 0 }}>
          <colgroup>
            <col className="w-16" /> {/* DATE */}
            <col className="w-24" /> {/* CUSTOMER */}
            <col className="w-16" /> {/* BILL NO. */}
            <col className="w-20" /> {/* BIKE MODEL */}
            <col className="w-20" /> {/* CONTENT */}
            <col className="w-24" /> {/* CHASSIS NO */}
            <col className="w-24" /> {/* FINANCE & CASH */}
            <col className="w-16" /> {/* CASH */}
            <col className="w-16" /> {/* ICICI UPI */}
            <col className="w-16" /> {/* HDFC UPI */}
            <col className="w-24" /> {/* TOTAL PAYMENT */}
            <col className="w-24" /> {/* PREMIUM CASH */}
            <col className="w-20" /> {/* REMAINING */}
            <col className="w-16" /> {/* NAME */}
            <col className="w-24" /> {/* TYPE OF EXPENSES */}
            <col className="w-16" /> {/* AMOUNT */}
            <col className="w-16" /> {/* BALANCE */}
            <col className="w-16" /> {/* BIKE CARADA */}
            <col className="w-20" /> {/* CARADA OUT */}
            <col className="w-12" /> {/* THEFT */}
            <col className="w-24" /> {/* OPENING BALANCE */}
            <col className="w-16" /> {/* BIKE STOCK */}
            <col className="w-16" /> {/* Actions */}
          </colgroup>
          <thead>
            <tr>
              <th className="w-24 px-1 py-1 bg-yellow-400 border border-gray-300 text-center font-bold">OPENING BALANCE</th>
              <th className="w-16 px-1 py-1 bg-yellow-400 border border-gray-300 text-center font-bold">213155</th>
              <th className="w-24 px-1 py-1 bg-green-300 border border-gray-300 text-center font-bold">CASH IN HAND</th>
              <th className="w-16 px-1 py-1 bg-green-300 border border-gray-300 text-center font-bold">112120</th>
              <th className="w-24 px-1 py-1 bg-orange-300 border border-gray-300 text-center font-bold">ONLINE PAYMENT</th>
              <th className="w-16 px-1 py-1 bg-orange-300 border border-gray-300 text-center font-bold">136209</th>
              <th className="w-16 px-1 py-1 bg-blue-300 border border-gray-300 text-center font-bold">DEPOSIT</th>
              <th className="w-16 px-1 py-1 bg-blue-300 border border-gray-300 text-center font-bold">240000</th>
              <th className="w-24 px-1 py-1 bg-green-300 border border-gray-300 text-center font-bold">TOTAL EXPENSES</th>
              <th className="w-12 px-1 py-1 bg-green-300 border border-gray-300 text-center font-bold">2105</th>
              <th className="w-16 px-1 py-1 bg-red-300 border border-gray-300 text-center font-bold">BIKE SALE</th>
              <th className="w-8 px-1 py-1 bg-red-300 border border-gray-300 text-center font-bold">9</th>
              <th className="w-24 px-1 py-1 bg-yellow-400 border border-gray-300 text-center font-bold">OPENING BALANCE</th>
              <th className="w-16 px-1 py-1 bg-yellow-400 border border-gray-300 text-center font-bold">112120</th>
              <th className="w-16 px-1 py-1 bg-gray-200 border border-gray-300 text-center">Actions</th>
            </tr>
            <tr>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">DATE</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">CUSTOMER</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">BILL NO.</th>
              <th className="w-20 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">BIKE MODEL</th>
              <th className="w-20 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">CONTENT</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">CHASSIS NO</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">FINANCE & CASH</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">CASH</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">ICICI UPI</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">HDFC UPI</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">TOTAL PAYMENT</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">PREMIUM CASH</th>
              <th className="w-20 px-1 py-1 border border-gray-300 text-center bg-blue-200 font-bold">REMAINING</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-gray-200 font-bold">NAME</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-gray-200 font-bold">TYPE OF EXPENSES</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-gray-200 font-bold">AMOUNT</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-gray-200 font-bold">BALANCE</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-yellow-200 font-bold">BIKE CARADA</th>
              <th className="w-20 px-1 py-1 border border-gray-300 text-center bg-yellow-200 font-bold">CARADA OUT</th>
              <th className="w-12 px-1 py-1 border border-gray-300 text-center bg-yellow-200 font-bold">THEFT</th>
              <th className="w-24 px-1 py-1 border border-gray-300 text-center bg-yellow-400 font-bold">BIKE STOCK</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center bg-yellow-400 font-bold">CLOSING BALANCE</th>
              <th className="w-16 px-1 py-1 border border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.length === 0 ? (
              <tr>
                <td colSpan={23} className="px-4 py-8 text-center border border-gray-300 bg-blue-100">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">No ledger entries found</p>
                    <button
                      onClick={addNewRow}
                      className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add First Entry
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              ledgerData.map((entry, index) => (
                <tr key={index} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'date')}
                  </td>
                  <td className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'customer')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'receiptNo')}
                  </td>
                  <td className="w-20 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'model')}
                  </td>
                  <td className="w-20 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'content')}
                  </td>
                  <td className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'chassisNo')}
                  </td>
                  <td className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'payment')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-green-50 font-semibold">
                    {renderEditableCell(entry, index, 'cash')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-orange-50 font-semibold">
                    {renderEditableCell(entry, index, 'iciciUpi')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-orange-50 font-semibold">
                    {renderEditableCell(entry, index, 'hdfc')}
                  </td>
                  <td className="w-24 px-1 py-1 border border-gray-300 text-center bg-blue-50 font-semibold">
                    {renderEditableCell(entry, index, 'total')}
                  </td>
                  <td className="w-24 px-1 py-1 border border-gray-300 text-center bg-red-50 font-semibold">
                    {renderEditableCell(entry, index, 'remaining')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-gray-100 font-semibold">
                    {renderEditableCell(entry, index, 'name')}
                  </td>
                  <td className="w-24 px-1 py-1 border border-gray-300 text-center bg-gray-100 font-semibold">
                    {renderEditableCell(entry, index, 'typeOfExpense')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-gray-100 font-semibold">
                    {renderEditableCell(entry, index, 'amount')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-gray-100 font-semibold">
                    {renderEditableCell(entry, index, 'balance')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-yellow-50 font-semibold">
                    {renderEditableCell(entry, index, 'bikeCarada')}
                  </td>
                  <td className="w-20 px-1 py-1 border border-gray-300 text-center bg-yellow-50 font-semibold">
                    {renderEditableCell(entry, index, 'bikeCaradaOut')}
                  </td>
                  <td className="w-12 px-1 py-1 border border-gray-300 text-center bg-yellow-50 font-semibold">
                    {renderEditableCell(entry, index, 'bikeTheft')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-yellow-100 font-semibold">
                    {renderEditableCell(entry, index, 'openingBalance')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-yellow-100 font-semibold">
                    {renderEditableCell(entry, index, 'bikeStock')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center bg-yellow-100 font-semibold">
                    {renderEditableCell(entry, index, 'closingBalance')}
                  </td>
                  <td className="w-16 px-1 py-1 border border-gray-300 text-center">
                    <div className="flex justify-center space-x-1">
                      {editingCell?.row === index || editingRow === index ? (
                        <>
                          <button
                            onClick={() => saveChanges(index)}
                            className="text-green-600 hover:text-green-800"
                            title="Save"
                            disabled={loading}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel"
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startRowEditing(index)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Row"
                            disabled={loading || editingRow !== null}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRow(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                            disabled={loading || editingRow !== null}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/* Summary row - only show when there's data */}
            {ledgerData.length > 0 && (
              <tr className="font-bold">
                <td colSpan={7} className="w-auto px-1 py-1 text-center border border-gray-300 bg-blue-200">
                  TOTAL
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-blue-200">
                  {totals.cash.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-blue-200">
                  {totals.iciciUpi.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-blue-200">
                  {totals.hdfc.toLocaleString()}
                </td>
                <td className="w-24 px-1 py-1 text-center border border-gray-300 bg-blue-200">
                  {totals.total.toLocaleString()}
                </td>
                <td className="w-24 px-1 py-1 text-center border border-gray-300 bg-blue-200">
                  {totals.remaining.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-gray-300">
                  TOTAL EXPENSES
                </td>
                <td className="w-24 px-1 py-1 text-center border border-gray-300 bg-gray-300">
                  {totals.sale.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-gray-300">
                  {totals.expenses.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-gray-300">
                  {totals.closingBalance.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-yellow-200">
                  {totals.bikeCarada.toLocaleString()}
                </td>
                <td className="w-20 px-1 py-1 text-center border border-gray-300 bg-yellow-200">
                  {totals.bikeCaradaOut.toLocaleString()}
                </td>
                <td className="w-12 px-1 py-1 text-center border border-gray-300 bg-yellow-200">
                  {totals.bikeTheft.toLocaleString()}
                </td>
                <td className="w-24 px-1 py-1 text-center border border-gray-300 bg-yellow-400">
                  {totals.openingBalance.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-yellow-400">
                  {totals.bikeStock.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 text-center border border-gray-300 bg-yellow-400">
                  {totals.closingBalance.toLocaleString()}
                </td>
                <td className="w-16 px-1 py-1 border border-gray-300"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyLedger;

