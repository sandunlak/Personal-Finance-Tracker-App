const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addaccountSchema = new Schema({
    accname: { type: String, required: true },
    accnumber: { type: Number, required: true },
    acctype: { type: String, required: true },
    accvalue: { type: Number, required: true },
    acccurrency: { type: String, required: true },
    convertedValue: { type: Number, default: 0 },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ['daily', 'weekly', 'monthly'], required: function() { return this.isRecurring; }},
    endDate: { type: Date, required: function() { return this.isRecurring; }},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true }
    
});

const Addaccount = mongoose.model('Addaccount', addaccountSchema);
module.exports = Addaccount;
