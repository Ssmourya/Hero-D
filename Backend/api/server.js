const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('../src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application continues running despite unhandled promise rejections
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application continues running despite uncaught exceptions in production
  // In development, we might want to exit the process
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Routes
const ledgerRoutes = require('../src/routes/ledgerRoutes');
const userRoutes = require('../src/routes/userRoutes');
const vehicleRoutes = require('../src/routes/vehicleRoutes');
const workshopRoutes = require('../src/routes/workshopRoutes');
const authRoutes = require('../src/routes/authRoutes');

app.use('/api/ledger', ledgerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Debug endpoint to check environment variables and connection status
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'not set',
    mongoConnected: isConnected,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    // Don't include sensitive information
  });
});

app.use(notFound);
app.use(errorHandler);

// MongoDB connection — memoized
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    // Log the MongoDB URI (without sensitive parts) for debugging
    const mongoUriForLogging = process.env.MONGO_URI
      ? process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
      : 'MongoDB URI not found';
    console.log('Connecting to MongoDB:', mongoUriForLogging);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    });

    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Don't throw the error - let the app continue even if DB connection fails
    // This allows the API to return appropriate error responses
  }
};

// Connect to MongoDB when the module is loaded
connectDB().catch(err => console.error('Initial connection error:', err));

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export the Express app as a serverless function handler
module.exports = app;
