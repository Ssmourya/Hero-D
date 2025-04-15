const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.route('/').get(getUsers);
router.route('/:id').get(getUserById);

// Protected routes - only Owner can create, update, or delete users
router.route('/').post(protect, authorize('Owner'), createUser);
router.route('/:id').put(protect, authorize('Owner'), updateUser);
router.route('/:id').delete(protect, authorize('Owner'), deleteUser);

module.exports = router;
