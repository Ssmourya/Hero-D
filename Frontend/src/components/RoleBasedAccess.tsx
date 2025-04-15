import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface RoleBasedAccessProps {
  allowedRoles: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user role
 * @param allowedRoles - String or array of roles that are allowed to see the children
 * @param children - Content to show if user has permission
 * @param fallback - Optional content to show if user doesn't have permission
 */
const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission based on their role
  const hasAccess = hasPermission(allowedRoles);
  
  // Render children if user has access, otherwise render fallback
  return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedAccess;
