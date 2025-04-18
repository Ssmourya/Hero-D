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

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

// MongoDB connection — memoized
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
  }
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res); // 👈 Let Vercel handle the serverless function request
};
