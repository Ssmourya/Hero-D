import React, { useState, useEffect } from 'react';
import { Users, User, Truck, Package, FileText, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../types';
import { dashboardService } from '../services/dashboardService';

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  icon,
  colorClass,
  onClick
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transform transition-transform duration-200 hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-full ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold">{count}</h3>
      </div>
      <p className="text-gray-600 text-sm font-medium mt-2">{title}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // Use a try-catch block to handle the case when the component is not inside a Router
  let navigate: any = null;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn('Dashboard component is not inside a Router context. Navigation will be disabled.');
  }

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    customerCount: 0,
    employeeCount: 0,
    vehicleCount: 0,
    serviceCount: 0,
    salesCount: 0,
    productCount: 0,
    supplierCount: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        console.log('Fetching dashboard stats...');
        const stats = await dashboardService.getDashboardStats();
        console.log('Received stats:', stats);

        // Safely handle the case where stats might be undefined or null
        if (!stats) {
          throw new Error('No data received from the server');
        }

        // Convert the stats to match our DashboardStats type
        const convertedStats: DashboardStats = {
          customerCount: stats.customerCount || 0,
          employeeCount: stats.employeeCount || 0,
          vehicleCount: stats.vehicleCount || 0,
          serviceCount: stats.serviceCount || 0,
          salesCount: stats.salesCount || 0,
          productCount: stats.productCount || 0,
          supplierCount: stats.supplierCount || 0,
          recentActivities: Array.isArray(stats.recentActivities)
            ? stats.recentActivities.map(activity => ({
                id: activity.id || 'unknown',
                type: activity.type || 'sale',
                title: activity.title || 'Unknown Activity',
                description: activity.description || '',
                // Ensure timestamp is properly handled
                timestamp: activity.timestamp instanceof Date ?
                  activity.timestamp.toISOString() :
                  activity.timestamp || new Date().toISOString()
              }))
            : []
        };

        console.log('Converted stats:', convertedStats);
        setDashboardStats(convertedStats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Set default values to prevent rendering errors
        setDashboardStats({
          customerCount: 0,
          employeeCount: 0,
          vehicleCount: 0,
          serviceCount: 0,
          salesCount: 0,
          productCount: 0,
          supplierCount: 0,
          recentActivities: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (section: string) => {
    // Map dashboard cards to their corresponding routes
    const routeMap: { [key: string]: string } = {
      'Employees': '/users', // Changed from '/employees' to '/users' to match the Users Management page
      'Customers': '/customers',
      'Suppliers': '/suppliers',
      'Products': '/products',
      'Sales': '/sales',
      'Services': '/services'
    };

    const route = routeMap[section];
    if (route && navigate) {
      console.log(`Navigating to ${route}`);
      navigate(route);
    } else if (route) {
      console.log(`Would navigate to ${route} if inside a Router context`);
      // Show an error message to the user
      setError(`Navigation to ${section} is not available. Please check your application setup.`);
    }
  };

  const cards = [
    {
      title: 'Employees',
      count: dashboardStats.employeeCount,
      icon: <User className="text-teal-600" size={24} />,
      colorClass: 'bg-teal-100'
    },
    {
      title: 'Customers',
      count: dashboardStats.customerCount,
      icon: <Users className="text-purple-600" size={24} />,
      colorClass: 'bg-purple-100'
    },
    {
      title: 'Suppliers',
      count: dashboardStats.supplierCount,
      icon: <Truck className="text-blue-600" size={24} />,
      colorClass: 'bg-blue-100'
    },
    {
      title: 'Products',
      count: dashboardStats.productCount,
      icon: <Package className="text-yellow-600" size={24} />,
      colorClass: 'bg-yellow-100'
    },
    {
      title: 'Sales',
      count: dashboardStats.salesCount,
      icon: <FileText className="text-green-600" size={24} />,
      colorClass: 'bg-green-100'
    },
    {
      title: 'Services',
      count: dashboardStats.serviceCount,
      icon: <Truck className="text-orange-600" size={24} />,
      colorClass: 'bg-orange-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
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
      )}

      <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {loading ? (
          <div className="col-span-6 flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {cards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                count={card.count}
                icon={card.icon}
                colorClass={card.colorClass}
                onClick={() => handleCardClick(card.title)}
              />
            ))}
          </>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : dashboardStats.recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activities found
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardStats.recentActivities.map((activity) => {
                let icon;
                let bgColor;
                let textColor;

                switch (activity.type) {
                  case 'sale':
                    icon = <FileText size={20} />;
                    bgColor = 'bg-green-100';
                    textColor = 'text-green-600';
                    break;
                  case 'service':
                    icon = <Truck size={20} />;
                    bgColor = 'bg-orange-100';
                    textColor = 'text-orange-600';
                    break;
                  case 'vehicle':
                    icon = <Car size={20} />;
                    bgColor = 'bg-blue-100';
                    textColor = 'text-blue-600';
                    break;
                  case 'customer':
                    icon = <Users size={20} />;
                    bgColor = 'bg-purple-100';
                    textColor = 'text-purple-600';
                    break;
                  case 'inventory':
                    icon = <Package size={20} />;
                    bgColor = 'bg-yellow-100';
                    textColor = 'text-yellow-600';
                    break;
                  default:
                    icon = <FileText size={20} />;
                    bgColor = 'bg-gray-100';
                    textColor = 'text-gray-600';
                }

                const timeAgo = getTimeAgo(activity.timestamp);

                return (
                  <div key={activity.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-4`}>
                      <div className={textColor}>{icon}</div>
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">{timeAgo}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate time ago
const getTimeAgo = (timestamp: string | Date): string => {
  const now = new Date();
  const activityTime = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diffMs = now.getTime() - activityTime.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) {
    return 'Just now';
  } else if (diffHrs < 24) {
    return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
};

export default Dashboard;



