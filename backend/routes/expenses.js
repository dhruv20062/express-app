const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now()
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses of logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
