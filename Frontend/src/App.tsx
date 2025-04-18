import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarNew from './components/Sidebar';
import Modal from './components/Modal';
import ProtectedRoute from './components/ProtectedRoute';
import FormManager from './components/FormManager';
import Dashboard from './components/Dashboard';
import DailyLedger from './components/DailyLedger';
import ProgressTrackerPage from './components/ProgressTrackerPage';
import UsersManagement from './components/UsersManagement';
import ShowroomManagement from './components/ShowroomManagement';
import WorkshopManagement from './components/WorkshopManagement';
import JobCardManagement from './components/JobCardManagement';
import CustomersManagement from './components/CustomersManagement';
import GenericContent from './components/GenericContent';
import SignIn from './home/SignIn';
import SignUp from './home/SignUp';
import ForgotPassword from './home/ForgotPassword';
import ResetPassword from './home/ResetPassword';

// Admin Components
import AdminDashboard from './components/AdminDashboard';
// Router imports are at the top of the file

// Import services
import { ledgerService, LedgerEntry } from './services/ledgerService';
import { userService, User } from './services/userService';
import { vehicleService, Vehicle } from './services/vehicleService';
import { workshopService, WorkshopEntry } from './services/workshopService';


// Interface already imported from ledgerService

// Wrap the main App component with Router
function AppContent() {
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userInfo');
    // Navigate to signin page
    navigate('/signin');
  };

  // Get the current location to set the selected menu based on the URL
  const location = window.location.pathname;

  // Set the selected menu based on the URL path
  useEffect(() => {
    if (location === '/users') {
      setSelectedMenu('Users');
    } else if (location === '/customers') {
      setSelectedMenu('Customers');
    } else if (location === '/suppliers') {
      setSelectedMenu('Suppliers');
    } else if (location === '/products') {
      setSelectedMenu('Products');
    } else if (location === '/sales') {
      setSelectedMenu('Sales');
    } else if (location === '/services') {
      setSelectedMenu('Services');
    } else if (location === '/') {
      setSelectedMenu('Dashboard');
    }
  }, [location]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'delete'>('create');
  const [modalTitle, setModalTitle] = useState('');
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Open modal with specific type and item
  const openModal = (type: 'create' | 'edit' | 'view' | 'delete', title: string, item: any = null) => {
    setModalType(type);
    setModalTitle(title);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      // Determine which service to use based on the modal title
      if (modalTitle.includes('Ledger')) {
        if (modalType === 'create') {
          const newEntry = await ledgerService.createLedgerEntry(formData);
          setLedgerData([newEntry, ...ledgerData]);
        } else if (modalType === 'edit' && currentItem?._id) {
          const updatedEntry = await ledgerService.updateLedgerEntry(currentItem._id, formData);
          setLedgerData(ledgerData.map(item => item._id === currentItem._id ? updatedEntry : item));
        } else if (modalType === 'delete' && currentItem?._id) {
          await ledgerService.deleteLedgerEntry(currentItem._id);
          setLedgerData(ledgerData.filter(item => item._id !== currentItem._id));
        }
      } else if (modalTitle.includes('User')) {
        if (modalType === 'create') {
          console.log('Creating new user with form data:', formData);
          try {
            // Make sure we're not sending any id or _id fields for new users
            const { id, _id, ...userData } = formData;
            const newUser = await userService.createUser(userData as User);
            console.log('New user created:', newUser);
            setUsersData([newUser, ...usersData]);
            alert('User created successfully!');
          } catch (error: any) {
            console.error('Error in handleSubmit when creating user:', error);
            alert(`Failed to create user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
          }
        } else if (modalType === 'edit' && currentItem?._id) {
          const updatedUser = await userService.updateUser(currentItem._id, formData);
          setUsersData(usersData.map(item => item._id === currentItem._id ? updatedUser : item));
        } else if (modalType === 'delete' && currentItem?._id) {
          await userService.deleteUser(currentItem._id);
          setUsersData(usersData.filter(item => item._id !== currentItem._id));
        }
      } else if (modalTitle.includes('Vehicle')) {
        if (modalType === 'create') {
          const newVehicle = await vehicleService.createVehicle(formData);
          setVehiclesData([newVehicle, ...vehiclesData]);
        } else if (modalType === 'edit' && currentItem?._id) {
          const updatedVehicle = await vehicleService.updateVehicle(currentItem._id, formData);
          setVehiclesData(vehiclesData.map(item => item._id === currentItem._id ? updatedVehicle : item));
        } else if (modalType === 'delete' && currentItem?._id) {
          await vehicleService.deleteVehicle(currentItem._id);
          setVehiclesData(vehiclesData.filter(item => item._id !== currentItem._id));
        }
      } else if (modalTitle.includes('Workshop') || modalTitle.includes('Service')) {
        if (modalType === 'create') {
          const newEntry = await workshopService.createWorkshopEntry(formData);
          setWorkshopData([newEntry, ...workshopData]);
        } else if (modalType === 'edit' && currentItem?._id) {
          const updatedEntry = await workshopService.updateWorkshopEntry(currentItem._id, formData);
          setWorkshopData(workshopData.map(item => item._id === currentItem._id ? updatedEntry : item));
        } else if (modalType === 'delete' && currentItem?._id) {
          await workshopService.deleteWorkshopEntry(currentItem._id);
          setWorkshopData(workshopData.filter(item => item._id !== currentItem._id));
        }
      }

      closeModal();
    } catch (error) {
      console.error('Error handling form submission:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // State for ledger data from API
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([
    {
      date: '24-03-25',
      customer: 'RAMESH 23 3 25',
      receiptNo: '11991',
      model: 'SPL+',
      content: 'BIKE SALE',
      chassisNo: '402',
      payment: 'CASHED 3-21',
      cash: 50000,
      iciciUpi: 24500,
      hdfc: 10000,
      total: 84500,
      expenses: 2105,
      sale: 84500
    },
    {
      date: '23-03-25',
      customer: 'RASHID 23 3',
      receiptNo: '11991',
      model: 'SPL+',
      content: 'BIKE SALE',
      chassisNo: '11295',
      payment: 'CASHED 3-25',
      cash: 15000,
      iciciUpi: 0,
      hdfc: 3800,
      total: 73800,
      expenses: 0,
      sale: 73800
    }
  ]);

  // State for users data
  const [usersData, setUsersData] = useState<User[]>([
    { _id: '1', id: 1, name: 'Rajesh Kumar', role: 'Owner', email: 'rajesh@example.com', status: 'Active' },
    { _id: '2', id: 2, name: 'Sunil Sharma', role: 'Manager', email: 'sunil@example.com', status: 'Active' },
    { _id: '3', id: 3, name: 'Priya Patel', role: 'Cashier', email: 'priya@example.com', status: 'Active' },
  ]);

  // State for vehicles data
  const [vehiclesData, setVehiclesData] = useState<Vehicle[]>([
    { id: 1, name: 'Hero Splendor+', price: 75000, description: 'India\'s most popular motorcycle', image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVybyUyMHNwbGVuZG9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Hero HF Deluxe', price: 65000, description: 'Economical and reliable commuter', image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Hero Glamour', price: 85000, description: 'Stylish and feature-rich', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
  ]);

  // State for workshop data
  const [workshopData, setWorkshopData] = useState<WorkshopEntry[]>([
    {
      id: 1,
      vehicle: 'Hero Splendor+ #8745',
      service: 'Oil Change, Brake Adjustment',
      status: 'In Progress',
      customer: 'Ramesh Kumar',
      date: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      cost: 1500
    },
    {
      id: 2,
      vehicle: 'Hero HF Deluxe #6532',
      service: 'Engine Tuning',
      status: 'Pending',
      customer: 'Sunil Sharma',
      date: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      cost: 2500
    }
  ]);

  // State for job cards data
  const [jobCardsData] = useState([
    { id: 'JC-2023-001', customer: 'Ramesh Kumar', vehicle: 'Hero Splendor+ #8745', serviceType: 'Regular Service', status: 'In Progress', createdOn: '24-03-2023' },
    { id: 'JC-2023-002', customer: 'Sunil Sharma', vehicle: 'Hero HF Deluxe #6532', serviceType: 'Engine Repair', status: 'Pending', createdOn: '23-03-2023' },
  ]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ledger data
        const ledgerEntries = await ledgerService.getAllLedgerEntries();
        if (ledgerEntries && ledgerEntries.length > 0) {
          setLedgerData(ledgerEntries);
        }

        // Fetch users data
        const users = await userService.getAllUsers();
        if (users && users.length > 0) {
          setUsersData(users);
        }

        // Fetch vehicles data
        const vehicles = await vehicleService.getAllVehicles();
        if (vehicles && vehicles.length > 0) {
          setVehiclesData(vehicles);
        }

        // Fetch workshop data
        const workshopEntries = await workshopService.getAllWorkshopEntries();
        if (workshopEntries && workshopEntries.length > 0) {
          setWorkshopData(workshopEntries);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Menu items are now managed in the Sidebar component

  // Dashboard content
  const renderDashboard = () => {
    return <Dashboard />;
  };

  // Users content
  const renderUsers = () => (
    <UsersManagement usersData={usersData} openModal={openModal} />
  );

  // Showroom content
  const renderShowroom = () => (
    <ShowroomManagement vehiclesData={vehiclesData} openModal={openModal} />
  );

  // Workshop content
  const renderWorkshop = () => (
    <WorkshopManagement workshopData={workshopData} openModal={openModal} />
  );

  // Daily Ledger content
  const renderDailyLedger = () => {
    return <DailyLedger />;
  };

  // Job Card content
  const renderJobCard = () => (
    <JobCardManagement jobCardsData={jobCardsData} openModal={openModal} />
  );

  // Generic content for other menu items
  const renderGenericContent = (title: string) => (
    <GenericContent title={title} openModal={openModal} />
  );

  // Render modal based on type
  const renderModalContent = () => {
    if (modalType !== 'create' && !currentItem) return null;

    return (
      <FormManager
        modalType={modalType}
        modalTitle={modalTitle}
        currentItem={currentItem}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    );

    // Old implementation removed to fix unreachable code
  };

  // State for progress tracker navigation - commented out as it's currently unused
  // const [progressTrackerSection, setProgressTrackerSection] = useState<string>('customer');

  // Function to handle navigation from progress tracker
  const handleProgressTrackerNavigation = (section: string) => {
    console.log('Progress tracker navigation to:', section);
    // Uncomment when needed: setProgressTrackerSection(section);
  };

  // Sample customer data - replace with actual data from API
  const customersData = [
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@example.com', address: 'Delhi' },
    { id: 2, name: 'Sunil Sharma', phone: '8765432109', email: 'sunil@example.com', address: 'Mumbai' },
    { id: 3, name: 'Priya Patel', phone: '7654321098', email: 'priya@example.com', address: 'Ahmedabad' },
  ];

  // Customers content
  const renderCustomers = () => (
    <CustomersManagement customersData={customersData} openModal={openModal} />
  );

  // Function to render content based on selected menu item
  const renderContent = () => {
    switch (selectedMenu) {
      // Admin section
      case 'Admin Dashboard':
        return <AdminDashboard />;
      case 'System Settings':
        return renderGenericContent('System Settings');

      // Regular dashboard
      case 'Dashboard':
        return renderDashboard();
      case 'Users':
      case 'Owner':
      case 'Manager':
      case 'Cashier':
      case 'TELLYCALLER':
      case 'Storekeeper':
        return renderUsers();
      case 'Customers':
        return renderCustomers();
      case 'Showroom':
        return renderShowroom();
      case 'Workshop':
        return renderWorkshop();
      case 'Progress Tracker':
        return <ProgressTrackerPage onNavigate={handleProgressTrackerNavigation} />;
      case 'Daily Ledger':
        return renderDailyLedger();
      case 'Job Card':
        return renderJobCard();
      case 'Free Service':
      case 'Paid service':
      case 'Accidental':
      case 'EXPENSES':
      case 'Engine Repair':
      case 'Complaint':
      case 'Warranty':
        return renderGenericContent(selectedMenu);
      case 'Banking':
        return renderGenericContent('Banking');
      case 'Demo':
        return renderGenericContent('Demo');
      case 'Report':
        return renderGenericContent('Report');
      case 'Account':
        return renderGenericContent(selectedMenu);
      case 'Vehicles':
        return renderGenericContent('Vehicles');
      case 'JOYRIDE':
        return renderGenericContent('JOYRIDE');
      case 'Inventory':
        return renderGenericContent('Inventory');

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      <SidebarNew onMenuSelect={setSelectedMenu} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-red-700 text-white p-4 flex items-center justify-between">
          <h1 className="text-4xl font-bold">{selectedMenu}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-800 rounded-lg hover:bg-red-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 p-4">
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {renderModalContent()}
      </Modal>
    </div>
  );
}

// Main App component that wraps AppContent with Router
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppContent />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;





