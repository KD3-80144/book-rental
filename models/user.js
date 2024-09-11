const mongoose = require('mongoose');
const booksUsersConnection = require('../dbConnectionBooksUsers');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    }
});

const User = booksUsersConnection.model('User', userSchema);

module.exports = User;
