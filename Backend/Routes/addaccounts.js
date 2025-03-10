const express = require("express");
const router = express.Router();
const Addaccount = require("../Models/Addaccount");
const authenticate = require("../Middleware/authenticate"); // Import authentication middleware

// Add a new account
router.route("/addacc").post(authenticate, (req, res) => {
    const { accname, accnumber, acctype, accvalue, acccurrency, isRecurring, recurrencePattern, endDate } = req.body;

    const newAddaccount = new Addaccount({
        accname,
        accnumber,
        acctype,
        accvalue,
        acccurrency,
        isRecurring,
        recurrencePattern,
        endDate,
        userId: req.user.id // Associate the account with the authenticated user's ID
    });

    newAddaccount
        .save()
        .then(() => {
            res.json({ message: "Your Account Added" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error adding Account", details: err.message });
        });
});

router.route("/showacc").get(authenticate, (req, res) => {
    Addaccount.find({ userId: req.user.id }) // Fetch accounts associated with the authenticated user
        .then((addaccounts) => {
            console.log("Authenticated User ID:", req.user.id); // Log the authenticated user's ID
            res.json(addaccounts);
        })
        .catch((err) => {
            console.error("Error fetching Account details:", err); // Log any errors
            res.status(500).json({ error: "Error fetching Account details", details: err.message });
        });
});


// Delete an account (authorized user only)
router.route("/delete/:id").delete(authenticate, async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Addaccount.findOneAndDelete({ _id: accountId, userId: req.user.id }); // Verify user ownership
        if (!account) {
            return res.status(403).json({ message: "Unauthorized: You cannot delete this account." });
        }

        res.status(200).send({ message: "Your Account deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error deleting Account", error: err.message });
    }
});

// Update an account (authorized user only)
router.route("/update/:id").put(authenticate, async (req, res) => {
    const accountId = req.params.id;
    const { accname, accnumber, acctype, accvalue, acccurrency, isRecurring, recurrencePattern, endDate } = req.body;

    const updateAddaccount = {
        accname,
        accnumber,
        acctype,
        accvalue,
        acccurrency,
        isRecurring,
        recurrencePattern,
        endDate
    };

    try {
        const account = await Addaccount.findOneAndUpdate(
            { _id: accountId, userId: req.user.id }, // Verify user ownership
            updateAddaccount,
            { new: true }
        );

        if (!account) {
            return res.status(403).json({ message: "Unauthorized: You cannot update this account." });
        }

        res.status(200).send({ message: "Account details updated", account });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error updating Account details", error: err.message });
    }
});

module.exports = router;
