const mongoose = require('mongoose');
require('dotenv').config();

const transactionsConnection = mongoose.createConnection(process.env.TRANSACTIONS_DB_CONNECTION_STRING);

transactionsConnection.on('connected', () => {
    console.log('Transactions DB connected');
});

module.exports = transactionsConnection;
