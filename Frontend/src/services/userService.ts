import { usersApi } from '../api/api';

export interface User {
  _id?: string;
  id?: string | number; // For compatibility with existing data
  name: string;
  role: string;
  email: string;
  status: string;
  lastLogin?: string;
  createdAt?: string;
  permissions?: string[];
}

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await usersApi.getAll();
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await usersApi.getById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData: User): Promise<User> => {
    try {
      console.log('Creating user with data:', userData);
      const response = await usersApi.create(userData);
      console.log('User created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (id: string, userData: User): Promise<User> => {
    try {
      const response = await usersApi.update(id, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await usersApi.delete(id);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
};
