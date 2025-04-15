import { workshopApi } from '../api/api';

export interface WorkshopEntry {
  _id?: string;
  id?: number; // For compatibility with existing data
  vehicle: string;
  customer: string;
  service: string;
  status: string;
  date: Date | string;
  estimatedCompletion: Date | string;
  cost: number;
}

export const workshopService = {
  // Get all workshop entries
  getAllWorkshopEntries: async (): Promise<WorkshopEntry[]> => {
    try {
      const response = await workshopApi.getAll();
      return response.data;
    } catch (error) {
      console.error('Error fetching workshop entries:', error);
      throw error;
    }
  },

  // Get a single workshop entry by ID
  getWorkshopEntryById: async (id: string): Promise<WorkshopEntry> => {
    try {
      const response = await workshopApi.getById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workshop entry with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new workshop entry
  createWorkshopEntry: async (workshopData: WorkshopEntry): Promise<WorkshopEntry> => {
    try {
      const response = await workshopApi.create(workshopData);
      return response.data;
    } catch (error) {
      console.error('Error creating workshop entry:', error);
      throw error;
    }
  },

  // Update an existing workshop entry
  updateWorkshopEntry: async (id: string, workshopData: WorkshopEntry): Promise<WorkshopEntry> => {
    try {
      const response = await workshopApi.update(id, workshopData);
      return response.data;
    } catch (error) {
      console.error(`Error updating workshop entry with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a workshop entry
  deleteWorkshopEntry: async (id: string): Promise<void> => {
    try {
      await workshopApi.delete(id);
    } catch (error) {
      console.error(`Error deleting workshop entry with ID ${id}:`, error);
      throw error;
    }
  }
};
