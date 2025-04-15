const express = require('express');
const router = express.Router();
const {
  getWorkshopEntries,
  getWorkshopEntryById,
  createWorkshopEntry,
  updateWorkshopEntry,
  deleteWorkshopEntry,
} = require('../controllers/workshopController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes - anyone can view workshop entries
router.route('/').get(getWorkshopEntries);
router.route('/:id').get(getWorkshopEntryById);

// Protected routes - only Owner and Manager can create workshop entries
router.route('/').post(protect, authorize(['Owner', 'Manager']), createWorkshopEntry);

// Protected routes - only Owner can update or delete workshop entries
router.route('/:id').put(protect, authorize('Owner'), updateWorkshopEntry);
router.route('/:id').delete(protect, authorize('Owner'), deleteWorkshopEntry);

module.exports = router;
