// recurringTransactions.js
const schedule = require('node-schedule');
const Addaccount = require('../Models/Addaccount');
const { sendEmailNotification } = require('./emailNotifications');

// Function to get the next due date for a recurring account
const getNextDueDate = (account) => {
    const { recurrencePattern, endDate } = account;
    let nextDueDate = new Date(account.updatedAt || account.createdAt);

    while (nextDueDate <= new Date()) {
        switch (recurrencePattern) {
            case 'daily':
                nextDueDate.setDate(nextDueDate.getDate() + 1);
                break;
            case 'weekly':
                nextDueDate.setDate(nextDueDate.getDate() + 7);
                break;
            case 'monthly':
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
        }
    }

    return nextDueDate;
};

// Function to check for upcoming or missed recurring transactions
const checkRecurringTransactions = () => {
    const today = new Date();
    Addaccount.find({ isRecurring: true, endDate: { $gte: today } })
        .then((recurringAccounts) => {
            recurringAccounts.forEach((account) => {
                const nextDueDate = getNextDueDate(account);
                if (nextDueDate <= today) {
                    sendEmailNotification(
                        'user@example.com', // Replace with the user's email address
                        'Upcoming or Missed Recurring Transaction',
                        `Your recurring transaction (${account.accname}) is due or missed.`
                    );
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// Schedule the checkRecurringTransactions function to run daily
schedule.scheduleJob('0 0 * * *', checkRecurringTransactions);

module.exports = { checkRecurringTransactions };
