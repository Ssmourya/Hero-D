import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';

const AdminDashboard: React.FC = () => {
  const { isAdmin, isOwner } = useAuth();

  // Only Admin and Owner should access this dashboard
  if (!isAdmin && !isOwner) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">You do not have permission to view the Admin Dashboard.</p>
      </div>
    );
  }

  // Return a blank white screen
  return (
    <div className="min-h-screen bg-white">
      {/* Blank white screen */}
      <Dashboard/>
    </div>
  );
};

export default AdminDashboard;
