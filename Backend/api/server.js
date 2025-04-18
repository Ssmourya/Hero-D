const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('../src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware with error handling
app.use(express.json({
  limit: '10mb',
  verify: (_, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        error: 'Invalid JSON',
        message: 'The request body contains invalid JSON',
        details: e.message
      });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Handle OPTIONS requests for CORS preflight
app.options('*', (_, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
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
app.get('/', (_, res) => {
  res.send('API is running...');
});

// Debug endpoint to check environment variables and connection status
app.get('/api/debug', (_, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'not set',
    mongoConnected: isConnected,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    // Don't include sensitive information
  });
});

// Test error endpoint for debugging error handling
app.get('/api/test-error', (req, res, next) => {
  try {
    // Simulate different types of errors based on query parameter
    const errorType = req.query.type || 'standard';

    switch(errorType) {
      case 'async':
        // Simulate an unhandled promise rejection
        Promise.reject(new Error('Test async error'));
        res.send('This should not be sent');
        break;

      case 'timeout':
        // Simulate a timeout
        setTimeout(() => {
          res.send('Delayed response after 35 seconds');
        }, 35000); // Longer than our timeout
        break;

      case 'db':
        // Simulate a database error
        throw new Error('Test database connection error');

      default:
        // Standard error
        throw new Error('Test error triggered manually');
    }
  } catch (error) {
    next(error); // Pass to error handler
  }
});

app.use(notFound);
app.use(errorHandler);

// MongoDB connection — memoized
let isConnected = false;

const connectDB = async () => {
  // If already connected, return immediately
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable is not defined');
      throw new Error('MongoDB URI is not defined');
    }

    // Log the MongoDB URI (without sensitive parts) for debugging
    const mongoUriForLogging = process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('Connecting to MongoDB:', mongoUriForLogging);

    // Set connection options with timeout
    const options = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 5
    };

    // Attempt to connect with retry logic
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        await mongoose.connect(process.env.MONGO_URI, options);
        isConnected = true;
        console.log('MongoDB connected successfully');
        return;
      } catch (error) {
        lastError = error;
        console.error(`MongoDB connection attempt failed (${retries} retries left):`, error.message);
        retries--;

        // Wait before retrying (exponential backoff)
        if (retries > 0) {
          const delay = (3 - retries) * 1000; // 1s, 2s, 3s
          console.log(`Retrying connection in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed to connect to MongoDB after multiple attempts');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // In serverless environment, we'll handle this error in the handler function
    // Don't throw here to prevent unhandled promise rejections
  }
};

// Don't connect immediately - we'll connect on demand in the serverless handler
// This prevents connection issues during cold starts

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Create a wrapper function for better error handling in serverless environment
const serverlessHandler = async (req, res) => {
  // Set a timeout to prevent function hanging
  const timeoutMs = 25000; // 25 seconds (Vercel has a 30s limit)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Function timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    // Log the incoming request for debugging
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers));

    // Race the function execution against the timeout
    await Promise.race([
      (async () => {
        // Ensure DB is connected
        await connectDB();

        // Pass the request to the Express app
        return app(req, res);
      })(),
      timeoutPromise
    ]);

    return;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Serverless function error:`, error);

    // If headers haven't been sent yet, send an error response
    if (!res.headersSent) {
      const statusCode = error.message.includes('timed out') ? 504 : 500;

      res.status(statusCode).json({
        error: statusCode === 504 ? 'Gateway Timeout' : 'Internal Server Error',
        message: statusCode === 504
          ? 'The request took too long to process'
          : 'The serverless function encountered an error',
        timestamp: new Date().toISOString(),
        // Don't include the actual error in production
        ...(process.env.NODE_ENV !== 'production' && { details: error.message })
      });
    }
  }
};

// Export the handler for Vercel
module.exports = serverlessHandler;
