export interface Activity {
  id: string;
  type: 'sale' | 'service' | 'vehicle' | 'customer' | 'inventory';
  title: string;
  description: string;
  timestamp: string | Date;
}

export interface DashboardStats {
  customerCount: number;
  employeeCount: number;
  vehicleCount: number;
  serviceCount: number;
  salesCount: number;
  productCount: number;
  supplierCount: number;
  recentActivities: Activity[];
}