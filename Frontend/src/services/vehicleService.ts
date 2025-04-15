import { vehiclesApi } from '../api/api';

export interface Vehicle {
  _id?: string;
  id?: number; // For compatibility with existing data
  name: string;
  price: number;
  description: string;
  image: string;
}

export const vehicleService = {
  // Get all vehicles
  getAllVehicles: async (): Promise<Vehicle[]> => {
    try {
      const response = await vehiclesApi.getAll();
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Get a single vehicle by ID
  getVehicleById: async (id: string): Promise<Vehicle> => {
    try {
      const response = await vehiclesApi.getById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new vehicle
  createVehicle: async (vehicleData: Vehicle): Promise<Vehicle> => {
    try {
      const response = await vehiclesApi.create(vehicleData);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update an existing vehicle
  updateVehicle: async (id: string, vehicleData: Vehicle): Promise<Vehicle> => {
    try {
      const response = await vehiclesApi.update(id, vehicleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a vehicle
  deleteVehicle: async (id: string): Promise<void> => {
    try {
      await vehiclesApi.delete(id);
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      throw error;
    }
  }
};
