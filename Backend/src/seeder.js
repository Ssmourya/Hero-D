const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Ledger = require('./models/ledgerModel');
const Vehicle = require('./models/vehicleModel');
const Workshop = require('./models/workshopModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  })
  .then(() => {
    console.log('MongoDB Connected for seeding');
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.log('Trying local MongoDB connection...');

    // Try local connection if cloud connection fails
    mongoose
      .connect(process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/dashboard', {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      })
      .then(() => {
        console.log('Local MongoDB Connected for seeding');
      })
      .catch((localErr) => {
        console.error(`Error connecting to local MongoDB: ${localErr.message}`);
        process.exit(1);
      });
  });

// Sample data
const users = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner',
    email: 'rajesh@example.com',
    status: 'Active',
  },
  {
    name: 'Sunil Sharma',
    role: 'Manager',
    email: 'sunil@example.com',
    status: 'Active',
  },
  {
    name: 'Priya Patel',
    role: 'Cashier',
    email: 'priya@example.com',
    status: 'Active',
  },
];

const ledgerEntries = [
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
  },
];

const vehicles = [
  {
    name: 'Hero Splendor+',
    price: 75000,
    description: 'India\'s most popular motorcycle',
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVybyUyMHNwbGVuZG9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    name: 'Hero HF Deluxe',
    price: 65000,
    description: 'Economical and reliable commuter',
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
];

const workshopEntries = [
  {
    vehicle: 'Hero Splendor+ #8745',
    customer: 'Ramesh Kumar',
    service: 'Oil Change, Brake Adjustment',
    status: 'In Progress',
    date: new Date(),
    estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    cost: 1500
  },
  {
    vehicle: 'Hero HF Deluxe #6532',
    customer: 'Sunil Sharma',
    service: 'Engine Tuning',
    status: 'Pending',
    date: new Date(),
    estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    cost: 2500
  },
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Ledger.deleteMany();
    await Vehicle.deleteMany();
    await Workshop.deleteMany();

    // Insert new data
    await User.insertMany(users);
    await Ledger.insertMany(ledgerEntries);
    await Vehicle.insertMany(vehicles);
    await Workshop.insertMany(workshopEntries);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from DB
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Ledger.deleteMany();
    await Vehicle.deleteMany();
    await Workshop.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
