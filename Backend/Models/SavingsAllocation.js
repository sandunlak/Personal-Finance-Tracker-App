const mongoose = require('mongoose');

const savingsAllocationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    allocationPercentage: { type: Number, required: true }
});

module.exports = mongoose.model('SavingsAllocation', savingsAllocationSchema);
