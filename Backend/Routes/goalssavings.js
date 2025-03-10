const express = require('express');
const router = express.Router();
const Goal = require('../Models/Goal');
const SavingsAllocation = require('../Models/SavingsAllocation');
const Transtrack = require('../Models/Transtrack');
const Addaccount = require('../Models/Addaccount');
const authenticate = require('../Middleware/authenticate'); // Import authentication middleware
const nodemailer = require('nodemailer');

// Set a new financial goal
router.post('/goals', authenticate, async (req, res) => {
    const { goalName, targetAmount, deadline } = req.body;

    try {
        // Use authenticated user's ID
        const userId = req.user.id;

        const newGoal = new Goal({ userId, goalName, targetAmount, deadline });
        await newGoal.save();
        res.json({ message: "Financial goal set", goal: newGoal });
    } catch (err) {
        res.status(500).json({ error: "Error setting financial goal", details: err.message });
    }
});

// Get all financial goals for the authenticated user
router.get('/getgoals', authenticate, async (req, res) => {
    try {
        // Use authenticated user's ID
        const userId = req.user.id;

        const goals = await Goal.find({ userId });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: "Error fetching financial goals", details: err.message });
    }
});

// Update goal's progress
router.put('/goals/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { currentAmount } = req.body;

    try {
        // Ensure the goal belongs to the authenticated user
        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { currentAmount },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: "Goal not found or not authorized to update this goal" });
        }

        res.json({ message: "Goal updated", goal });
    } catch (err) {
        res.status(500).json({ error: "Error updating goal", details: err.message });
    }
});

// Handle incoming transactions to automatically allocate savings (unchanged)
// Handle incoming transactions to automatically allocate savings
// Handle incoming transactions to update goal's current amount for income transactions
router.post('/addtran', authenticate, async (req, res) => {
    const { value, transtype, category, description, accountId, tags, date, goalId } = req.body;

    try {
        if (transtype === 'income' && !goalId) {
            return res.status(400).json({ error: "Goal ID is required for income transactions" });
        }

        // Use authenticated user's ID
        const userId = req.user.id;

        // Create a new transaction record
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

        // Find the related account
        const account = await Addaccount.findOne({ _id: accountId, userId });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        if (transtype === 'income') {
            account.accvalue += value;

            // Find the associated goal
            const goal = await Goal.findOne({ _id: goalId, userId });
            if (!goal) {
                return res.status(404).json({ error: "Goal not found" });
            }

            // Update the goal's currentAmount
            const remainingAmount = goal.targetAmount - goal.currentAmount;
            const amountToAdd = Math.min(value, remainingAmount);
            goal.currentAmount += amountToAdd;

            try {
                await goal.save();
                console.log(`Goal "${goal.goalName}" updated:`, goal);

                // Check if the goal is achieved
                if (goal.currentAmount >= goal.targetAmount) {
                    console.log(`Goal "${goal.goalName}" is achieved!`);

                    // Send email notification to the authenticated user (req.user.email)
                    await sendEmailNotification(req.user.email, goal.goalName);
                }
            } catch (err) {
                console.error(`Error saving goal "${goal.goalName}":`, err.message);
                return res.status(500).json({ error: "Error updating goal's current amount", details: err.message });
            }
        } else if (transtype === 'expense') {
            account.accvalue -= value;
        }

        await account.save();
        res.json({ message: "Transaction added and goal updated if applicable" });
    } catch (err) {
        console.error("Error adding transaction:", err);
        res.status(500).json({ error: "Error adding transaction", details: err.message });
    }
});


// Function to send email notifications
async function sendEmailNotification(userEmail, goalName) {
    try {
        // Configure nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email provider
            auth: {
                user: process.env.EMAIL_USER, // Use environment variable for email user
                pass: process.env.EMAIL_PASSWORD // Use environment variable for email password
            }
        });

        // Define the email content
        const mailOptions = {
            from: '"Your App Name" <no-reply@yourapp.com>', // Sender address
            to: userEmail, // Recipient's email
            subject: 'Congratulations on Achieving Your Goal!',
            text: `Dear ${userEmail},\n\nCongratulations! You have successfully achieved your financial goal: "${goalName}". Keep up the great work!\n\nBest regards,\nYour App Team`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} regarding goal "${goalName}"`);
        return { success: true, message: `Email sent to ${userEmail}` };
    } catch (err) {
        console.error("Error sending email notification:", err.message);
        return { success: false, message: "Email could not be sent" };
    }
}





module.exports = router;
