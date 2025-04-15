const express = require('express');
const router = express.Router();
const {
  getLedgerEntries,
  getLedgerEntryById,
  createLedgerEntry,
  updateLedgerEntry,
  deleteLedgerEntry,
} = require('../controllers/ledgerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes - anyone can view ledger entries
router.route('/').get(getLedgerEntries);
router.route('/:id').get(getLedgerEntryById);

// Protected routes - Owner and Manager can create ledger entries
router.route('/').post(protect, authorize(['Owner', 'Manager']), createLedgerEntry);

// Protected routes - only Owner can update or delete ledger entries
router.route('/:id').put(protect, authorize('Owner'), updateLedgerEntry);
router.route('/:id').delete(protect, authorize('Owner'), deleteLedgerEntry);

module.exports = router;
