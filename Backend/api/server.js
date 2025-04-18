const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('../src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Import routes
const ledgerRoutes = require('../src/routes/ledgerRoutes');
const userRoutes = require('../src/routes/userRoutes');
const vehicleRoutes = require('../src/routes/vehicleRoutes');
const workshopRoutes = require('../src/routes/workshopRoutes');
const authRoutes = require('../src/routes/authRoutes');

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

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB Cloud Connected');
  } catch (cloudError) {
    console.error(`Cloud MongoDB error: ${cloudError.message}`);
    try {
      await mongoose.connect(process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/dashboard', {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Local MongoDB Connected');
    } catch (localError) {
      console.error(`Local MongoDB error: ${localError.message}`);
    }
  }
};

// Connect to DB once
let isConnected = false;
const ensureDBConnection = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await ensureDBConnection();
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Connect to the database when the app starts
ensureDBConnection().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Export the Express app for Vercel serverless functions
module.exports = app;