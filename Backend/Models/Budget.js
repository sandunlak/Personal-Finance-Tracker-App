const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Budget Schema
const budgetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    period: {
        type: String,
        enum: ['week', 'month', 'year', 'onetime'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['lkr', 'usd'],
        required: true
    },
    categories: {
        type: [String],
        enum: ['vehicle', 'food', 'transport'],
        required: true
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Addaccount', // Ensure this matches the exact model name
        required: true
    }
});

// Check if budget is overspent
budgetSchema.methods.isOverspent = function(account) {
    return this.amount > account.accvalue;
};

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;

