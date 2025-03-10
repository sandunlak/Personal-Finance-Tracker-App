const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    type : {
        type : String,
        required:true
    },
    amount : {
        type : Number,
        required:true

    },
    category : {
        type : String,
        required:true
    },
    description : {
        type : String,
        required:true
    },
    tags : {
        type : String,
        required:true
    },
    date : {
        type : Date,
        required:true
    }



})

const Transaction = mongoose.model("Transaction",transactionSchema);

module.exports = Transaction;