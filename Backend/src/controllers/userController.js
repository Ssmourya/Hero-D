const User = require('../models/userModel');
// Import mock data for when the database is not available
const { users: mockUsers } = require('../data/mockData');

// Function to handle MongoDB connection errors
const handleMongoError = (error) => {
  console.error('MongoDB operation failed:', error.message);
  global.isMongoConnected = false;
  return { error: true, message: error.message };
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      console.log('Using mock data for users');
      return res.json(mockUsers);
    }

    const users = await User.find({});
    res.json(users);
  } catch (error) {
    handleMongoError(error);
    // If MongoDB is not connected, return mock data
    if (!global.isMongoConnected) {
      return res.json(mockUsers);
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single user
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    console.log('Backend - Creating user with data:', req.body);

    // Validate required fields
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      console.error('Backend - Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields: name, email, role' });
    }

    // If MongoDB is not connected, use mock data
    if (!global.isMongoConnected) {
      console.log('Using mock data for creating user');
      const newUser = {
        _id: String(mockUsers.length + 1),
        ...req.body,
        status: req.body.status || 'Active'
      };
      mockUsers.push(newUser);
      return res.status(201).json(newUser);
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Backend - Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User(req.body);
    const createdUser = await user.save();
    console.log('Backend - User created successfully:', createdUser);
    res.status(201).json(createdUser);
  } catch (error) {
    handleMongoError(error);
    // If MongoDB is not connected, use mock data
    if (!global.isMongoConnected) {
      const newUser = {
        _id: String(mockUsers.length + 1),
        ...req.body,
        status: req.body.status || 'Active'
      };
      mockUsers.push(newUser);
      return res.status(201).json(newUser);
    }
    console.error('Backend - Error creating user:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      Object.assign(user, req.body);
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
