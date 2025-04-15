const Ledger = require('../models/ledgerModel');

// @desc    Get all ledger entries
// @route   GET /api/ledger
// @access  Public
const getLedgerEntries = async (req, res) => {
  try {
    const ledgerEntries = await Ledger.find({}).sort({ createdAt: -1 });
    res.json(ledgerEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single ledger entry
// @route   GET /api/ledger/:id
// @access  Public
const getLedgerEntryById = async (req, res) => {
  try {
    const ledgerEntry = await Ledger.findById(req.params.id);
    
    if (ledgerEntry) {
      res.json(ledgerEntry);
    } else {
      res.status(404).json({ message: 'Ledger entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a ledger entry
// @route   POST /api/ledger
// @access  Public
const createLedgerEntry = async (req, res) => {
  try {
    const ledgerEntry = new Ledger(req.body);
    const createdEntry = await ledgerEntry.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a ledger entry
// @route   PUT /api/ledger/:id
// @access  Public
const updateLedgerEntry = async (req, res) => {
  try {
    const ledgerEntry = await Ledger.findById(req.params.id);
    
    if (ledgerEntry) {
      Object.assign(ledgerEntry, req.body);
      const updatedEntry = await ledgerEntry.save();
      res.json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Ledger entry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a ledger entry
// @route   DELETE /api/ledger/:id
// @access  Public
const deleteLedgerEntry = async (req, res) => {
  try {
    const ledgerEntry = await Ledger.findById(req.params.id);
    
    if (ledgerEntry) {
      await ledgerEntry.deleteOne();
      res.json({ message: 'Ledger entry removed' });
    } else {
      res.status(404).json({ message: 'Ledger entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLedgerEntries,
  getLedgerEntryById,
  createLedgerEntry,
  updateLedgerEntry,
  deleteLedgerEntry,
};
