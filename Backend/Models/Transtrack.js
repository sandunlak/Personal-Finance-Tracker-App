const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transtrackSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
    transtype: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        enum: ['food', 'transportation', 'entertainment', 'others'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addaccount',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Transtrack = mongoose.model('Transtrack', transtrackSchema);

module.exports = Transtrack;
