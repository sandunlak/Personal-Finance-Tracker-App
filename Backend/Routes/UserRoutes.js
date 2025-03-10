const express = require('express');
const { login, register, getAllUsers, updateUser, deleteUser, getUserDetails } = require('../Controllers/authController');
const upload = require('../Middleware/multerConfig');
const authenticate = require('../Middleware/authenticate'); // Import authenticate middleware
const Transtrack = require('../Models/Transtrack');
const Addaccount = require('../Models/Addaccount');
const Goal = require('../Models/Goal'); // Assuming you have a model for Goals
const Budget = require('../Models/Budget'); // Assuming you have a model for Budgets

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, allow access
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

const router = express.Router();

router.post('/login', login);
router.post('/register', upload.single('photo'), register);

// Admin routes with authenticate and isAdmin middleware
router.get('/users', authenticate, isAdmin, getAllUsers); // Authenticated admin can get all users
router.put('/users/:id', authenticate, isAdmin, updateUser); // Authenticated admin can update users
router.delete('/users/:id', authenticate, isAdmin, deleteUser); // Authenticated admin can delete users

// Financial Summary Route
router.route('/all-users-summary').get(authenticate, isAdmin, async (req, res) => {
    try {
        const accounts = await Addaccount.find();
        const transactions = await Transtrack.find();

        const userFinancialSummary = {};

        accounts.forEach(account => {
            if (account.userId) {
                const userId = account.userId.toString();
                if (!userFinancialSummary[userId]) {
                    userFinancialSummary[userId] = {
                        totalIncome: 0,
                        totalExpenses: 0,
                        netBalance: 0
                    };
                }
            }
        });

        transactions.forEach(transaction => {
            const account = accounts.find(acc => acc._id.toString() === transaction.accountId?.toString());
            if (account && account.userId) {
                const userId = account.userId.toString();
                if (transaction.transtype === 'income') {
                    userFinancialSummary[userId].totalIncome += transaction.value;
                } else if (transaction.transtype === 'expense') {
                    userFinancialSummary[userId].totalExpenses += transaction.value;
                }
            }
        });

        Object.keys(userFinancialSummary).forEach(userId => {
            const summary = userFinancialSummary[userId];
            summary.netBalance = summary.totalIncome - summary.totalExpenses;
        });

        res.json(userFinancialSummary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error generating financial summary for all users", details: err.message });
    }
});

// User-specific routes
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await getUserDetails(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user details.', details: err.message });
    }
});

router.put('/me', authenticate, async (req, res) => {
    try {
        const updatedUser = await updateUser(req.user.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User details updated successfully.', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating user details.', details: err.message });
    }
});

router.delete('/me', authenticate, async (req, res) => {
    try {
        const deletedUser = await deleteUser(req.user.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User account deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting user account.', details: err.message });
    }
});

// Get the authenticated user's goals
router.get('/my-goals', authenticate, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.status(200).json(goals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching goals.', details: err.message });
    }
});

// Get the authenticated user's budgets
router.get('/my-budgets', authenticate, async (req, res) => {
    try {
        const budgets = await Budget.find({ account: req.user.id });
        res.status(200).json(budgets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching budgets.', details: err.message });
    }
});

// Get the authenticated user's transactions
router.get('/my-transactions', authenticate, async (req, res) => {
    try {
        const transactions = await Transtrack.find({ accountId: req.user.id });
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching transactions.', details: err.message });
    }
});
// Get all authenticated user's details, goals, budgets, and transactions
router.get('/my-details', authenticate, async (req, res) => {
    try {
        // Fetch user details
        const user = await getUserDetails(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch user's goals
        const goals = await Goal.find({ userId: req.user.id });

        // Fetch user's budgets
        const budgets = await Budget.find({ account: req.user.id });

        // Fetch user's transactions
        const transactions = await Transtrack.find({ accountId: req.user.id });

        // Consolidate all information into a single response
        const response = {
            userDetails: user,
            goals,
            budgets,
            transactions,
        };

        res.status(200).json(response);
    } catch (err) {
        console.error('Error fetching user information:', err);
        res.status(500).json({ error: 'Error fetching user information.', details: err.message });
    }
});


module.exports = router;
