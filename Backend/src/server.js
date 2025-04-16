const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const ledgerRoutes = require('./routes/ledgerRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/ledger', ledgerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Global variable to track MongoDB connection status
global.isMongoConnected = false;

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'URI exists' : 'URI is missing');

    try {
      // Try to connect to the cloud MongoDB first with a timeout
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      });
      console.log('MongoDB Cloud Connected');
      global.isMongoConnected = true;
      return true;
    } catch (cloudError) {
      console.error(`Cloud MongoDB connection error: ${cloudError.message}`);
      console.log('Attempting to connect to local MongoDB...');

      try {
        // If cloud connection fails, try local MongoDB with a timeout
        await mongoose.connect(process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/dashboard', {
          serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });
        console.log('Local MongoDB Connected');
        global.isMongoConnected = true;
        return true;
      } catch (localError) {
        console.error(`Local MongoDB connection error: ${localError.message}`);
        throw new Error('All MongoDB connection attempts failed');
      }
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Server will continue running, but database operations will use mock data');
    global.isMongoConnected = false;
    return false;
  }
};

// Start server after attempting to connect to MongoDB
const startServer = async () => {
  try {
    // First try to connect to MongoDB
    await connectDB();

    // Then start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    // Continue with mock data
    global.isMongoConnected = false;

    // Start server anyway
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} (with mock data)`);
    });
  }
};

// Call the function to start the server
startServer();
