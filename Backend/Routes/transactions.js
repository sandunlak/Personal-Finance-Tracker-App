const router = require("express").Router();
let Transtrack = require("../Models/Transtrack");
let Addaccount = require("../Models/Addaccount");
const authenticate = require("../Middleware/authenticate"); // Import authentication middleware

// Add a new transaction
router.route("/addtransaction").post(authenticate, async (req, res) => {
    const { value, transtype, category, description, accountId, tags, date } = req.body;

    try {
        // Verify the account belongs to the authenticated user
        const account = await Addaccount.findOne({ _id: accountId, userId: req.user.id });
        if (!account) {
            return res.status(404).json({ error: "Account not found or does not belong to the user" });
        }

        // Create new transaction
        const newTranstrack = new Transtrack({
            value,
            transtype,
            category,
            description,
            accountId,
            tags,
            date: date || Date.now()
        });

        await newTranstrack.save();

        // Update account value based on transaction type
        if (transtype === 'income') {
            account.accvalue += value;
        } else if (transtype === 'expense') {
            account.accvalue -= value;
        }

        await account.save();

        res.json({ message: "Transaction added and account updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error adding transaction", details: err.message });
    }
});

// Show transactions for the authenticated user
router.route("/showtransactions").get(authenticate, async (req, res) => {
    try {
        // Find accounts for the authenticated user
        const userAccounts = await Addaccount.find({ userId: req.user.id });
        const accountIds = userAccounts.map(account => account._id);

        // Find transactions related to the user's accounts
        const transtracks = await Transtrack.find({ accountId: { $in: accountIds } });
        res.json(transtracks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching transactions", details: err.message });
    }
});

// Filter transactions for the authenticated user
router.route("/filtertransactions").post(authenticate, async (req, res) => {
    const { tags, startDate, endDate } = req.body;

    try {
        // Find accounts for the authenticated user
        const userAccounts = await Addaccount.find({ userId: req.user.id });
        const accountIds = userAccounts.map(account => account._id);

        // Build filter criteria
        let filterCriteria = { accountId: { $in: accountIds } };

        if (tags) {
            filterCriteria.tags = { $in: tags };
        }

        if (startDate && endDate) {
            filterCriteria.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            filterCriteria.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            filterCriteria.date = { $lte: new Date(endDate) };
        }

        // Find transactions matching the filter criteria
        const transtracks = await Transtrack.find(filterCriteria);
        res.json(transtracks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error filtering transactions", details: err.message });
    }
});

// Update a transaction
router.route("/update/:id").put(authenticate, async (req, res) => {
    const transactionId = req.params.id;
    const { value, transtype, category, description, accountId, tags, date } = req.body;

    try {
        // Verify transaction and ownership
        const transaction = await Transtrack.findOne({ _id: transactionId }).populate('accountId');
        if (!transaction || transaction.accountId.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this transaction" });
        }

        // Update the transaction
        transaction.value = value;
        transaction.transtype = transtype;
        transaction.category = category;
        transaction.description = description;
        transaction.accountId = accountId;
        transaction.tags = tags;
        transaction.date = date || Date.now();

        await transaction.save();

        res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Error updating transaction", details: err.message });
    }
});

// Delete a transaction
router.route("/delete/:id").delete(authenticate, async (req, res) => {
    const transactionId = req.params.id;

    try {
        // Verify transaction and ownership
        const transaction = await Transtrack.findOne({ _id: transactionId }).populate('accountId');
        if (!transaction || transaction.accountId.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to delete this transaction" });
        }

        // Delete the transaction
        await transaction.remove();
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Error deleting transaction", details: err.message });
    }
});

module.exports = router;
