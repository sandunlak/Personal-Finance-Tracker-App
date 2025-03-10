const express = require('express');
const router = express.Router();
const Transtrack = require('../Models/Transtrack');
const authenticate = require('../Middleware/authenticate'); // Import authentication middleware
const Addaccount = require("../Models/Addaccount");

// Generate report for spending trends over time
router.route('/spending-trends').get(authenticate, async (req, res) => {
    try {
        const { startDate, endDate, categories, tags } = req.query;

        let query = { userId: req.user.id }; // Add userId filter to ensure the user only sees their data
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (categories) {
            query.category = { $in: categories.split(',') };
        }
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        const transactions = await Transtrack.find(query);
        console.log(transactions); // Log transactions to debug

        const trends = transactions.reduce((acc, transaction) => {
            if (transaction.date) {
                const date = transaction.date.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += transaction.value;
            }
            return acc;
        }, {});

        res.json(trends);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error generating spending trends report", details: err.message });
    }
});

// Visualize income vs. expenses
router.route('/income-expenses').get(authenticate, async (req, res) => {
    try {
        const { startDate, endDate, tags } = req.query;

        // Retrieve accounts for the authenticated user
        const userAccounts = await Addaccount.find({ userId: req.user.id });
        const accountIds = userAccounts.map(account => account._id);

        // Build filter query
        let query = { accountId: { $in: accountIds } };
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (tags) {
            query.tags = { $in: tags.split(',') }; // Ensure tags are handled as an array
        }

        // Fetch transactions
        const transactions = await Transtrack.find(query);

        let incomeTotal = 0;
        let expenseTotal = 0;
        let incomeTransactions = [];
        let expenseTransactions = [];

        // Calculate totals and group transactions
        transactions.forEach(transaction => {
            if (transaction.transtype === 'income') {
                incomeTotal += transaction.value;
                incomeTransactions.push(transaction);
            } else if (transaction.transtype === 'expense') {
                expenseTotal += transaction.value;
                expenseTransactions.push(transaction);
            }
        });

        res.json({
            income: {
                total: incomeTotal,
                transactions: incomeTransactions
            },
            expense: {
                total: expenseTotal,
                transactions: expenseTransactions
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error generating income vs. expenses report", details: err.message });
    }
});



// Include filters for specific time periods, categories, or tags
router.route('/filtered-transactions').get(authenticate, async (req, res) => {
    try {
        const { startDate, endDate, categories, tags } = req.query;

        // Retrieve accounts for the authenticated user
        const userAccounts = await Addaccount.find({ userId: req.user.id });
        const accountIds = userAccounts.map(account => account._id);

        // Build filter query
        let query = { accountId: { $in: accountIds } }; // Filter by the user's accounts
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (categories) {
            query.category = { $in: categories.split(',') }; // Split categories into an array
        }
        if (tags) {
            query.tags = { $in: tags.split(',') }; // Split tags into an array
        }

        // Fetch transactions
        const transactions = await Transtrack.find(query);
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching filtered transactions", details: err.message });
    }
});

module.exports = router;
