const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    receiptNo: {
      type: String,
      default: '',
    },
    model: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    chassisNo: {
      type: String,
      default: '',
    },
    payment: {
      type: String,
      default: '',
    },
    cash: {
      type: Number,
      default: 0,
    },
    iciciUpi: {
      type: Number,
      default: 0,
    },
    hdfc: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    expenses: {
      type: Number,
      default: 0,
    },
    sale: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
    typeOfExpense: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    bikeCarada: {
      type: Number,
      default: 0,
    },
    bikeCaradaOut: {
      type: Number,
      default: 0,
    },
    bikeTheft: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    bikeStock: {
      type: Number,
      default: 0,
    },
    closingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;
