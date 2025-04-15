// Mock data for when the database is not available

const users = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    role: 'Owner',
    email: 'rajesh@example.com',
    password: 'password123', // In a real app, this would be hashed
    status: 'Active'
  },
  {
    _id: '2',
    name: 'Sunil Sharma',
    role: 'Manager',
    email: 'sunil@example.com',
    password: 'password123', // In a real app, this would be hashed
    status: 'Active'
  },
  {
    _id: '3',
    name: 'Priya Patel',
    role: 'Cashier',
    email: 'priya@example.com',
    password: 'password123', // In a real app, this would be hashed
    status: 'Active'
  }
];

const vehicles = [
  {
    _id: '1',
    name: 'Hero Splendor+',
    price: 75000,
    description: 'India\'s most popular motorcycle',
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVybyUyMHNwbGVuZG9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    _id: '2',
    name: 'Hero HF Deluxe',
    price: 65000,
    description: 'Economical and reliable commuter',
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    _id: '3',
    name: 'Hero Glamour',
    price: 85000,
    description: 'Stylish and feature-rich',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  }
];

const workshopEntries = [
  {
    _id: '1',
    vehicle: 'Hero Splendor+ #8745',
    service: 'Oil Change, Brake Adjustment',
    status: 'In Progress',
    customer: 'Ramesh Kumar',
    date: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 1500
  },
  {
    _id: '2',
    vehicle: 'Hero HF Deluxe #6532',
    service: 'Engine Tuning',
    status: 'Pending',
    customer: 'Sunil Sharma',
    date: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 2500
  },
  {
    _id: '3',
    vehicle: 'Hero Glamour #9021',
    service: 'Full Service',
    status: 'In Progress',
    customer: 'Priya Patel',
    date: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 3500
  }
];

const ledgerEntries = [
  {
    _id: '1',
    date: '24-03-25',
    customer: 'RAMESH 23 3 25',
    receiptNo: '11991',
    model: 'SPL+',
    content: 'BIKE SALE',
    chassisNo: '11896',
    payment: 'NAGAURA',
    cash: 5000,
    iciciUpi: 10000,
    hdfc: 0,
    total: 15000,
    expenses: 0,
    sale: 75000
  },
  {
    _id: '2',
    date: '23-03-25',
    customer: 'SUNIL 22 3 25',
    receiptNo: '11992',
    model: 'HF DELUXE',
    content: 'BIKE SALE',
    chassisNo: '11897',
    payment: 'CASH',
    cash: 65000,
    iciciUpi: 0,
    hdfc: 0,
    total: 65000,
    expenses: 0,
    sale: 65000
  }
];

module.exports = {
  users,
  vehicles,
  workshopEntries,
  ledgerEntries
};
