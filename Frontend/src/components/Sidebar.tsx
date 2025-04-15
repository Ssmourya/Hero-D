import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, BarChart3, Users, Store, Wrench, Wallet, FileText, PieChart, Car, Package, ClipboardList, Clock, UserCheck, CalendarDays, ClipboardCheck, ShieldAlert, Settings, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

interface SidebarProps {
  onMenuSelect: (menu: string) => void;
}

export default function Sidebar({ onMenuSelect }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [submenuPositions, setSubmenuPositions] = useState<{[key: string]: number}>({});
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isAdmin, isOwner } = useAuth();

  // Effect to handle Daily Ledger specific adjustments
  useEffect(() => {
    // If Daily Ledger is selected, update submenu positions
    if (selectedMenuItem === 'Daily Ledger' && expandedItem) {
      // Force a recalculation of positions
      setTimeout(() => {
        setSubmenuPositions(prev => ({ ...prev }));
      }, 50);
    }
  }, [selectedMenuItem, expandedItem]);

  // Effect to handle clicks outside the sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && expandedItem) {
        setExpandedItem(null);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedItem]);

  // Effect to handle window resize
  useEffect(() => {
    function handleResize() {
      // Update submenu positions when window is resized
      if (expandedItem && sidebarRef.current) {
        setSubmenuPositions(prev => ({ ...prev }));
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [expandedItem]);

  const menuItems: MenuItem[] = [
    // Admin section - only visible to Admin and Owner roles
    ...(isAdmin || isOwner ? [
      { label: 'Admin Dashboard', icon: <ShieldAlert className="w-5 h-5" /> },
      { label: 'User Management', icon: <Users className="w-5 h-5" /> },
      { label: 'Workshop Management', icon: <Wrench className="w-5 h-5" /> },
      { label: 'Financial Management', icon: <DollarSign className="w-5 h-5" /> },
      { label: 'Inventory Management', icon: <Package className="w-5 h-5" /> },
      { label: 'Billing and Sales', icon: <FileText className="w-5 h-5" /> },

      { label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
      { label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
    ] : []),
    // Regular menu items
    { label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Users', icon: <Users className="w-5 h-5" />, submenu: [
      { label: 'Owner', icon: <Users className="w-4 h-4" /> },
      { label: 'Manager', icon: <Users className="w-4 h-4" /> },
      { label: 'Cashier', icon: <Users className="w-4 h-4" /> },
      { label: 'TELLYCALLER', icon: <Users className="w-4 h-4" /> },
      { label: 'Storekeeper', icon: <Users className="w-4 h-4" /> },
      { label: 'Staff', icon: <Users className="w-4 h-4" /> },
      { label: 'Workshop', icon: <Users className="w-4 h-4" /> },
    ]},
    { label: 'Showroom', icon: <Store className="w-5 h-5" /> },
    { label: 'Workshop', icon: <Wrench className="w-5 h-5" />, submenu: [
      { label: 'Daily Ledger', icon: <FileText className="w-4 h-4" /> },
      { label: 'Job Card', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Free Service', icon: <Wrench className="w-4 h-4" /> },
      { label: 'Paid service', icon: <Wallet className="w-4 h-4" /> },
      { label: 'Accidental', icon: <Car className="w-4 h-4" /> },
      { label: 'EXPENSES', icon: <FileText className="w-4 h-4" /> },
      { label: 'Engine Repair', icon: <Wrench className="w-4 h-4" /> },
      { label: 'Complaint', icon: <FileText className="w-4 h-4" /> },
      { label: 'Warranty', icon: <FileText className="w-4 h-4" /> },
    ]},
    { label: 'Banking', icon: <Wallet className="w-5 h-5" /> },
    { label: 'Demo', icon: <FileText className="w-5 h-5" /> },
    { label: 'Report', icon: <PieChart className="w-5 h-5" /> },
    { label: 'Account', icon: <Users className="w-5 h-5" /> },
    { label: 'Vehicles', icon: <Car className="w-5 h-5" /> },
    { label: 'JOYRIDE', icon: <Car className="w-5 h-5" /> },
    { label: 'Inventory', icon: <Package className="w-5 h-5" /> },

  ];

  const toggleSubmenu = (label: string, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      setSubmenuPositions(prev => ({ ...prev, [label]: buttonRect.top }));
    }

    // If we're opening a submenu, make sure we have the latest sidebar width
    if (expandedItem !== label) {
      // Force a recalculation of positions on next render
      setTimeout(() => {
        if (sidebarRef.current) {
          // This will trigger a re-render with the correct sidebar width
          setSubmenuPositions(prev => ({ ...prev }));
        }
      }, 0);
    }

    setExpandedItem(expandedItem === label ? null : label);
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItem === item.label;


    return (
      <div key={item.label} className="relative">
        <button
          onClick={(e) => {
            if (hasSubmenu) {
              toggleSubmenu(item.label, e);
            } else {
              onMenuSelect(item.label);
              setSelectedMenuItem(item.label);
              setExpandedItem(null); // Close any open submenu when clicking a regular item
            }
          }}
          className={`w-full text-left px-5 py-3 flex items-center text-white hover:bg-red-800 transition-colors
            ${depth > 0 ? 'pl-10' : ''}`}
        >
          <span className="mr-3">{item.icon}</span>
          <span className="text-base">{item.label}</span>
          {hasSubmenu && (
            <ChevronRight className={`ml-auto w-4 h-4 transition-transform
              ${isExpanded ? 'transform rotate-90' : ''}`}
            />
          )}
        </button>
        {hasSubmenu && isExpanded && (
          <div className="fixed w-56 bg-red-800 shadow-xl rounded-r-lg overflow-hidden z-[1000] border border-red-900" style={{ top: `${submenuPositions[item.label] || 0}px`, left: `${sidebarRef.current?.offsetWidth || 288}px` }}>
            {item.submenu?.map(subItem => (
              <button
                key={subItem.label}
                onClick={() => {
                  onMenuSelect(subItem.label);
                  setSelectedMenuItem(subItem.label);
                  setExpandedItem(null); // Close submenu after selection
                }}
                className="w-full text-left px-5 py-3 flex items-center text-white hover:bg-red-900 transition-colors"
              >
                <span className="mr-3">{subItem.icon}</span>
                <span className="text-base">{subItem.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={sidebarRef} className="w-62 bg-red-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 bg-black flex items-center justify-between">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRChlTvFpOsFjQBRyiHD0Nind_yND_QmiuFLA&s"
          alt="Hero Logo"
          className="w-full h-10 object-cover "
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full overflow-y-auto bg-red-700 py-4 ">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </div>
  );
}
