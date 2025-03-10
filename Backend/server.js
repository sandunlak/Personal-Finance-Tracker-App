const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const userRoutes = require('./Routes/UserRoutes');
const { checkRecurringTransactions } = require('./Services/recurringTransactions');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users/', userRoutes);

// MongoDB connection string
const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString)
    .then(() => console.log("Database connected"))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

const transactionRouter = require("./Routes/transactions");
const addaccountRouter = require("./Routes/addaccounts");
const budgetRouter = require("./Routes/budgets");
const financialReportsRouter = require("./Routes/financialReports");
const goalsavingRouter = require("./Routes/goalssavings");
const savingsallocationRouter = require("./Routes/goalssavings");
const convertCurrencyRoute = require('./Routes/currency');



app.use("/Addaccount", addaccountRouter);
app.use("/Transtrack", transactionRouter);
app.use("/Budget", budgetRouter);
app.use("/FinancialReports", financialReportsRouter);
app.use("/api/goals", goalsavingRouter);
app.use("/savingsallocation",savingsallocationRouter);
app.use('/convertcurrency', convertCurrencyRoute);


// Add this test route
app.get('/test-recurring', (req, res) => {
    checkRecurringTransactions();
    res.send('Recurring transactions checked');
});

// Schedule the checkRecurringTransactions function to run daily
checkRecurringTransactions();

const port = 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
