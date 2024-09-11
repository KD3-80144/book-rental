const mongoose = require('mongoose');
require('dotenv').config();

const booksUsersConnection = mongoose.createConnection(process.env.BOOKS_USERS_DB_CONNECTION_STRING);

booksUsersConnection.on('connected', () => {
    console.log('Books & Users DB connected');
});

module.exports = booksUsersConnection;
