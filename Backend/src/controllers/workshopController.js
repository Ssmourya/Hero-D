const Workshop = require('../models/workshopModel');

// @desc    Get all workshop entries
// @route   GET /api/workshop
// @access  Public
const getWorkshopEntries = async (req, res) => {
  try {
    const workshopEntries = await Workshop.find({}).sort({ date: -1 });
    res.json(workshopEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single workshop entry
// @route   GET /api/workshop/:id
// @access  Public
const getWorkshopEntryById = async (req, res) => {
  try {
    const workshopEntry = await Workshop.findById(req.params.id);
    
    if (workshopEntry) {
      res.json(workshopEntry);
    } else {
      res.status(404).json({ message: 'Workshop entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a workshop entry
// @route   POST /api/workshop
// @access  Public
const createWorkshopEntry = async (req, res) => {
  try {
    const workshopEntry = new Workshop(req.body);
    const createdEntry = await workshopEntry.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a workshop entry
// @route   PUT /api/workshop/:id
// @access  Public
const updateWorkshopEntry = async (req, res) => {
  try {
    const workshopEntry = await Workshop.findById(req.params.id);
    
    if (workshopEntry) {
      Object.assign(workshopEntry, req.body);
      const updatedEntry = await workshopEntry.save();
      res.json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Workshop entry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a workshop entry
// @route   DELETE /api/workshop/:id
// @access  Public
const deleteWorkshopEntry = async (req, res) => {
  try {
    const workshopEntry = await Workshop.findById(req.params.id);
    
    if (workshopEntry) {
      await workshopEntry.deleteOne();
      res.json({ message: 'Workshop entry removed' });
    } else {
      res.status(404).json({ message: 'Workshop entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkshopEntries,
  getWorkshopEntryById,
  createWorkshopEntry,
  updateWorkshopEntry,
  deleteWorkshopEntry,
};
