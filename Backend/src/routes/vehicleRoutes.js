const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes - anyone can view vehicles
router.route('/').get(getVehicles);
router.route('/:id').get(getVehicleById);

// Protected routes - only Owner can create, update, or delete vehicles
router.route('/').post(protect, authorize('Owner'), createVehicle);
router.route('/:id').put(protect, authorize('Owner'), updateVehicle);
router.route('/:id').delete(protect, authorize('Owner'), deleteVehicle);

module.exports = router;
