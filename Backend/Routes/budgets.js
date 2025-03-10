const express = require('express');
const router = express.Router();
const Budget = require('../Models/Budget');
const Addaccount = require('../Models/Addaccount');
const authenticate = require('../Middleware/authenticate'); // Import the middleware

// Add a new budget
router.route('/addbudget').post(authenticate, async (req, res) => {
    const { name, period, amount, currency, categories, accountId } = req.body;

    try {
        // Find the account and verify ownership
        const account = await Addaccount.findOne({ _id: accountId, userId: req.user.id });
        if (!account) {
            return res.status(404).json({ error: 'Account not found or does not belong to you' });
        }

        // Create new budget
        const newBudget = new Budget({
            name,
            period,
            amount,
            currency,
            categories,
            account: accountId
        });

        // Check if budget is overspent
        if (newBudget.isOverspent(account)) {
            return res.status(400).json({ message: 'Budget is overspent! Please adjust the account balance.' });
        }

        await newBudget.save();
        res.status(201).json({ message: 'Budget added successfully', budget: newBudget });
    } catch (err) {
        console.error("Error adding budget:", err);
        res.status(500).json({ error: 'Error adding budget', details: err.message });
    }
});

// Show budgets for the current user only
router.route('/showbudget').get(authenticate, async (req, res) => {
    try {
        // Find all accounts for the authenticated user
        const userAccounts = await Addaccount.find({ userId: req.user.id });

        if (!userAccounts.length) {
            return res.status(404).json({ message: 'No accounts found for the user.' });
        }

        // Extract account IDs
        const accountIds = userAccounts.map(account => account._id);

        // Find budgets associated with these accounts
        const budgets = await Budget.find({ account: { $in: accountIds } }).populate('account');

        res.status(200).json(budgets);
    } catch (err) {
        console.error("Error fetching budgets:", err);
        res.status(500).json({ error: 'Error fetching budgets', details: err.message });
    }
});

// Update a budget
router.route('/updatebudget/:id').put(authenticate, async (req, res) => {
    const budgetId = req.params.id;
    const { name, period, amount, currency, categories, accountId } = req.body;

    try {
        // Find the budget and ensure it belongs to the user
        const budget = await Budget.findOne({ _id: budgetId }).populate('account');
        if (!budget || budget.account.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You cannot update this budget.' });
        }

        // Update the budget
        budget.name = name;
        budget.period = period;
        budget.amount = amount;
        budget.currency = currency;
        budget.categories = categories;
        await budget.save();

        res.status(200).json({ message: 'Budget updated successfully', budget });
    } catch (err) {
        console.error("Error updating budget:", err);
        res.status(500).json({ error: 'Error updating budget', details: err.message });
    }
});

// Delete a budget
router.route('/deletebudget/:id').delete(authenticate, async (req, res) => {
    const budgetId = req.params.id;

    try {
        // Find and delete the budget
        const budget = await Budget.findOneAndDelete({ _id: budgetId }).populate('account');
        if (!budget || budget.account.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You cannot delete this budget.' });
        }

        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (err) {
        console.error("Error deleting budget:", err);
        res.status(500).json({ error: 'Error deleting budget', details: err.message });
    }
});

module.exports = router;
