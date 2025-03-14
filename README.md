# Personal-Finance-Tracker-App
# Backend Project

## Description
This is a backend application built using Express.js. It includes functionalities for user management, transactions, account handling, budgets, financial reporting, currency conversion, and goal savings. Testing is implemented with Jest and Supertest. Email functionality is powered by Nodemailer.

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB

### Installation Steps
1. Clone the Repository:
   ```bash
   git clone <repository-url>
   cd Backend

# Project Documentation

## Install Dependencies

### To install all project dependencies:
```bash
npm install bcrypt cors dotenv express fs jsonwebtoken mongoose multer nodemon path

npm install jest supertest --save-dev
npm start

## User Management
- **GET** `/api/users/:id` - Retrieve user information by ID.
- **POST** `/api/users/register` - Register a new user.
- **POST** `/api/users/login` - Authenticate user and return a JWT token.

## Admin Routes
- **GET** `/users` - Fetch all users (Admin only).
- **PUT** `/users/:id` - Update a user's data (Admin only).
- **DELETE** `/users/:id` - Delete a user (Admin only).
- **GET** `/all-users-summary` - Generate a financial summary of all users.

## User-Specific Routes
- **GET** `/my-goals` - Retrieve the goals of the authenticated user.
- **GET** `/my-budgets` - Retrieve the budgets associated with the authenticated user.
- **GET** `/my-transactions` - Fetch transactions for the authenticated user's accounts.
- **GET** `/my-details` - Retrieve consolidated details of the authenticated user, including goals, budgets, accounts, and transactions.
- **GET** `/me` - Retrieve details of the currently authenticated user.
- **PUT** `/me` - Update the details of the currently authenticated user.
- **DELETE** `/me` - Delete the account of the currently authenticated user.

## Transactions
- **GET** `/showtransactions` - Retrieve all transactions.
- **POST** `/addtransaction` - Create a new transaction.
- **PUT** `/update/:id` - Update a specific transaction.
- **DELETE** `/delete/:id` - Delete a transaction by ID.
- **GET** `/filtertransactions` - Filter specific transactions.

## Accounts
- **GET** `/showacc` - Retrieve all accounts.
- **POST** `/addacc` - Add a new account.
- **PUT** `/update/:id` - Update account details.
- **DELETE** `/delete/:id` - Remove an account by ID.

## Budgets
- **GET** `/showbudget` - Get budget details.
- **POST** `/addbudget` - Create a new budget.
- **PUT** `/updatebudget/:id` - Update existing budget details.
- **DELETE** `/deletebudget/:id` - Delete a specific budget.

## Financial Reports
- **GET** `/income-expenses` - Visualize income vs. expenses.
- **GET** `/filtered-transactions` - Filter for specific time periods, categories, or tags.
- **GET** `/spending-trends` - Report for spending trends over time.

## Goals and Savings
- **GET** `/api/getgoals` - Retrieve all savings goals.
- **POST** `/api/goals` - Add a new saving goal.
- **PUT** `/api/goals/:id` - Update a saving goal.
- **DELETE** `/api/goals/:id` - Remove a saving goal by ID.
- **POST** `/api/addtran` - Handle incoming transactions to update goal's current amount for income transactions.

## Currency Conversion
- **POST** `/` - Convert currency values between different currencies.

