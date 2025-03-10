const mongoose = require('mongoose');

// Define Goal Schema
const goalSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'User' 
        },
        goalName: { 
            type: String, 
            required: true, 
            trim: true // Ensures leading/trailing spaces are removed
        },
        targetAmount: { 
            type: Number, 
            required: true, 
            min: 0 // Ensures the target amount cannot be negative
        },
        currentAmount: { 
            type: Number, 
            default: 0, 
            min: 0 // Ensures the current amount cannot be negative
        },
        deadline: { 
            type: Date, 
            required: true,
            validate: { // Validates that the deadline is a future date
                validator: function(value) {
                    return value > Date.now();
                },
                message: 'Deadline must be a future date'
            }
        }
    },
    {
        timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
    }
);

module.exports = mongoose.model('Goal', goalSchema);
