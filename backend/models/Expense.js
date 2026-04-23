const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Bills', 'Entertainment', 'Shopping', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
