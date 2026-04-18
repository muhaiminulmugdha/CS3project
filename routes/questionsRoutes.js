const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Question model
const Question = mongoose.model('Question', new mongoose.Schema({
    askedquestions: String,
    createdAt: { type: Date, default: Date.now }
}));

router.get('/ask_bros', async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.render('ask_bros', { questions });
    } catch (err) {
        console.error(err);
        res.send('Error fetching questions');
    }
});

router.post('/ask-question', async (req, res) => {
    try {
        const newQuestion = new Question({ 
            askedquestions: req.body.ask_question 
        });
        await newQuestion.save();
        console.log('Question saved!');
        res.redirect('/ask_bros');
    } catch (err) {
        console.error(err);
        res.send('Error saving question');
    }
});

module.exports = router;