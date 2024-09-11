const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Book = require('../models/book');
const User = require('../models/user');

router.post('/issue', async (req, res) => {
    const { bookName, userId, issueDate } = req.body;

    try {
        // Find the book by name to get its ObjectId
        const book = await Book.findOne({ name: bookName });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create a new transaction with bookId, not bookName
        const transaction = new Transaction({
            bookId: book._id,  // Use book ObjectId here
            userId: user._id,
            issueDate: issueDate || new Date(),
            isReturned: false 
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/return', async (req, res) => {
    const { bookName, userId, returnDate } = req.body;

    try {
        // Find the book by its name and log the book details
        const book = await Book.findOne({ name: bookName });
        if (!book) {
            console.log('Book not found');
            return res.status(404).json({ message: 'Book not found' });
        }

        console.log('Book found:', book._id);

        // Find the user by their ID and log the user details
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user._id);

        // Find the active transaction (book not returned yet)
        const transaction = await Transaction.findOne({
            bookId: book._id,
            userId: user._id,
            isReturned: false
        });

        console.log('Transaction search query:', {
            bookId: book._id,
            userId: user._id,
            isReturned: false
        });

        if (!transaction) {
            console.log('No active transaction found for bookId:', book._id, 'and userId:', user._id);
            return res.status(404).json({ message: 'No active transaction found for this book and user' });
        }

        // If a transaction is found, calculate rent and mark the transaction as returned
        const returnDateTime = new Date(returnDate || new Date());
        const issueDateTime = new Date(transaction.issueDate);
        const daysRented = Math.ceil((returnDateTime - issueDateTime) / (1000 * 60 * 60 * 24));
        const rent = daysRented * book.rentPerDay;

        transaction.returnDate = returnDateTime;
        transaction.rent = rent;
        transaction.isReturned = true;

        await transaction.save();
        res.json(transaction);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/book/:bookName', async (req, res) => {
    const { bookName } = req.params;

    try {
        const book = await Book.findOne({ name: bookName });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const transactions = await Transaction.find({ bookId: book._id }).populate('userId');
        const issuedUsers = transactions.map(t => t.userId.name);
        const currentlyIssued = transactions.find(t => !t.isReturned);

        res.json({
            totalIssuedCount: transactions.length,
            issuedUsers,
            currentlyIssued: currentlyIssued ? currentlyIssued.userId.name : 'Not issued at the moment'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/book/:bookName/rent', async (req, res) => {
    const { bookName } = req.params;

    try {
        const book = await Book.findOne({ name: bookName });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        
        const transactions = await Transaction.find({ bookId: book._id, rent: { $ne: null } });
        const totalRent = transactions.reduce((total, transaction) => total + transaction.rent, 0);

        res.json({ totalRent });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:userId/books', async (req, res) => {
    const { userId } = req.params;

    try {
        const transactions = await Transaction.find({ userId }).populate('bookId');
        const booksIssued = transactions.map(t => t.bookId.name);

        res.json({ booksIssued });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/issuedInRange', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const transactions = await Transaction.find({
            issueDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate('bookId').populate('userId');

        const issuedBooks = transactions.map(t => ({
            book: t.bookId.name,
            issuedTo: t.userId.name,
            issueDate: t.issueDate
        }));

        res.json(issuedBooks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
