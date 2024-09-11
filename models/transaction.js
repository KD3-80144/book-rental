    const mongoose = require('mongoose');
    const transactionsConnection = require('../dbConnectionTransactions');

    const TransactionSchema = new mongoose.Schema({
        bookId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Book', 
            required: true },

        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true 
            },
        
        issueDate: { 
            type: Date, 
            required: true
        },

        returnDate: { 
            type: Date
            
        },

        rent: {
            type: Number
        },

        isReturned: { 
                type: Boolean, 
                default: false 
            }
    });

    const Transaction = transactionsConnection.model('Transaction', TransactionSchema);

    module.exports = Transaction;
