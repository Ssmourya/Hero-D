const User = require('../models/userModel');
// Check if User model is loaded correctly
console.log('User model:', User ? 'Loaded' : 'Not loaded');
const jwt = require('jsonwebtoken');
const { users: mockUsers } = require('../data/mockData');

// Function to handle MongoDB connection errors
const handleMongoError = (error) => {
  console.error('MongoDB operation failed:', error.message);
  global.isMongoConnected = false;
  return { error: true, message: error.message };
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log('Backend - Registering user with data:', req.body);

    // Validate required fields
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      console.error('Backend - Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields: name, email, password, role' });
    }

    // If MongoDB is not connected, use mock data
    if (!global.isMongoConnected) {
      console.log('Using mock data for registering user');
      // Check if user with this email already exists in mock data
      const existingUser = mockUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const newUser = {
        _id: String(mockUsers.length + 1),
        name,
        email,
        role,
        status: 'Active',
        // Don't store actual password in mock data
        password: 'HASHED_PASSWORD'
      };
      mockUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        token: generateToken(newUser._id)
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Backend - Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
      console.log('Backend - User registered successfully:', user.name);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    handleMongoError(error);
    console.error('Backend - Error registering user:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log('Backend - Login attempt with email:', req.body.email);

    const { email, password } = req.body;

    // If MongoDB is not connected, use mock data
    if (!global.isMongoConnected) {
      console.log('Using mock data for login');
      // For mock data, just check if email exists and return success
      // In a real app, you would check the password too
      const mockUser = mockUsers.find(user => user.email === email);
      if (mockUser) {
        return res.json({
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status,
          token: generateToken(mockUser._id)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      console.log('Backend - Login successful for user:', user.name);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id)
      });
    } else {
      console.error('Backend - Invalid email or password');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    handleMongoError(error);
    console.error('Backend - Error logging in:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // If MongoDB is not connected, use mock data
    if (!global.isMongoConnected) {
      console.log('Using mock data for user profile');
      // In a real app, you would get the user ID from the token
      // For mock data, just return the first user
      const mockUser = mockUsers[0];
      return res.json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status
      });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    handleMongoError(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
