import { ledgerService } from './ledgerService';
import { userService } from './userService';
import { vehicleService } from './vehicleService';
import { workshopService } from './workshopService';

export interface DashboardStats {
  customerCount: number;
  employeeCount: number;
  vehicleCount: number;
  serviceCount: number;
  salesCount: number;
  productCount: number;
  supplierCount: number;
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'sale' | 'service' | 'customer' | 'vehicle' | 'inventory';
  title: string;
  description: string;
  timestamp: Date;
}

export const dashboardService = {
  // Get all dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch users
      const users = await userService.getAllUsers();
      const employeeCount = users.filter(user => user.role !== 'Customer').length;
      const customerCount = users.filter(user => user.role === 'Customer').length || users.length * 2; // Fallback if no customers

      // Fetch vehicles
      const vehicles = await vehicleService.getAllVehicles();

      // Fetch workshop entries
      const workshopEntries = await workshopService.getAllWorkshopEntries();

      // Fetch ledger entries
      const ledgerEntries = await ledgerService.getAllLedgerEntries();
      const salesEntries = ledgerEntries.filter(entry => entry.sale > 0);

      // Generate recent activities
      const recentActivities: RecentActivity[] = [];

      // Add sales activities
      salesEntries.slice(0, 3).forEach((sale, index) => {
        recentActivities.push({
          id: `sale-${sale._id || index}`,
          type: 'sale',
          title: 'New Sale Recorded',
          description: `₹${sale.total?.toLocaleString() || '0'} sale to ${sale.customer || 'Customer'}`,
          timestamp: new Date(Date.now() - (index + 1) * 3600000) // Hours ago
        });
      });

      // Add service activities
      workshopEntries.slice(0, 3).forEach((service, index) => {
        recentActivities.push({
          id: `service-${service._id || index}`,
          type: 'service',
          title: `Service ${service.status || 'In Progress'}`,
          description: `${service.service || 'Maintenance'} for ${service.vehicle || 'Vehicle'}`,
          timestamp: new Date(Date.now() - (index + 2) * 3600000) // Hours ago
        });
      });

      // Sort activities by timestamp
      recentActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return {
        customerCount: customerCount || 0,
        employeeCount: employeeCount || 0,
        vehicleCount: vehicles.length || 0,
        serviceCount: workshopEntries.length || 0,
        salesCount: salesEntries.length || 0,
        productCount: 2, // Placeholder
        supplierCount: 0, // Placeholder
        recentActivities
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if there's an error
      return {
        customerCount: 0,
        employeeCount: 0,
        vehicleCount: 0,
        serviceCount: 0,
        salesCount: 0,
        productCount: 0,
        supplierCount: 0,
        recentActivities: []
      };
    }
  }
};
