const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        const newUser = new User({ name, email });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
