import { ledgerApi } from '../api/api';

export interface LedgerEntry {
  _id?: string;
  date: string;
  customer: string;
  receiptNo: string;
  model: string;
  content: string;
  chassisNo: string;
  payment: string;
  cash: number;
  iciciUpi: number;
  hdfc: number;
  total: number;
  remaining?: number;
  expenses: number;
  sale: number;
  name?: string;
  typeOfExpense?: string;
  amount?: number;
  balance?: number;
  bikeCarada?: number;
  bikeCaradaOut?: number;
  bikeTheft?: number;
  openingBalance?: number;
  bikeStock?: number;
  closingBalance?: number;
}

export const ledgerService = {
  // Get all ledger entries
  getAllLedgerEntries: async (): Promise<LedgerEntry[]> => {
    try {
      const response = await ledgerApi.getAll();
      return response.data;
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
      throw error;
    }
  },

  // Get a single ledger entry by ID
  getLedgerEntryById: async (id: string): Promise<LedgerEntry> => {
    try {
      const response = await ledgerApi.getById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entry with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new ledger entry
  createLedgerEntry: async (ledgerData: LedgerEntry): Promise<LedgerEntry> => {
    try {
      const response = await ledgerApi.create(ledgerData);
      return response.data;
    } catch (error) {
      console.error('Error creating ledger entry:', error);
      throw error;
    }
  },

  // Update an existing ledger entry
  updateLedgerEntry: async (id: string, ledgerData: LedgerEntry): Promise<LedgerEntry> => {
    try {
      const response = await ledgerApi.update(id, ledgerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ledger entry with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a ledger entry
  deleteLedgerEntry: async (id: string): Promise<void> => {
    try {
      await ledgerApi.delete(id);
    } catch (error) {
      console.error(`Error deleting ledger entry with ID ${id}:`, error);
      throw error;
    }
  }
};
