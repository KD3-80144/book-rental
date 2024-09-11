const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ count: books.length, books });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const { name, category, rentPerDay } = req.body;
    try {
        const book = new Book({ name, category, rentPerDay });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/search/:term', async (req, res) => {
    const { term } = req.params;
    try {
        
        const regex = new RegExp(`^${term.trim()}$`, 'i');
        const books = await Book.find({ name: regex });
        
        if (books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        const response = {
            totalCount: books.length,
            bookList: books
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/rent/:minPrice/:maxPrice', async (req, res) => {
    const { minPrice, maxPrice } = req.params; 
    try {
        const books = await Book.find({
            rentPerDay: { $gte: minPrice, $lte: maxPrice }
        });

        res.json({ count: books.length, books });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
