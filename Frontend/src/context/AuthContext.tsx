import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  token: string;
}

// Define the context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isManager: boolean;
  isStaff: boolean;
  isWorkshop: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasPermission: (requiredRoles: string | string[]) => boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isOwner: false,
  isManager: false,
  isStaff: false,
  isWorkshop: false,
  loading: true,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  // Check if user has permission based on role
  const hasPermission = (requiredRoles: string | string[]) => {
    if (!user) return false;

    // Convert to array if string
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Check if user's role is in the required roles
    return roles.includes(user.role);
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';
  const isOwner = user?.role === 'Owner';
  const isManager = user?.role === 'Manager';
  const isStaff = user?.role === 'Staff';
  const isWorkshop = user?.role === 'Workshop';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isOwner,
        isManager,
        isStaff,
        isWorkshop,
        loading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
