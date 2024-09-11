const mongoose = require('mongoose');
const booksUsersConnection = require('../dbConnectionBooksUsers');

// Define User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure emails are unique
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] // Email validation
    }
});

const User = booksUsersConnection.model('User', userSchema);

module.exports = User;
