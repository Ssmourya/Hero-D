const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    estimatedCompletion: {
      type: Date,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
