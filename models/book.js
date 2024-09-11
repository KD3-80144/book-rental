const mongoose = require('mongoose');
const booksUsersConnection = require('../dbConnectionBooksUsers');

const BookSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
     },

    category: { 
        type: String, 
        required: true 
    },
    rentPerDay: { 
        type: Number, 
        required: true 
    },
});

const Book = booksUsersConnection.model('Book', BookSchema);

module.exports = Book;
