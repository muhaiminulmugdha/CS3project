const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/Question');

router.get('/help_bros', async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.render('help_bros', { questions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database query error');
    }
});

module.exports = router;