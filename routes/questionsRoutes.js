const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');

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
        const newQuestion = new Question({ askedquestions: req.body.ask_question });
        await newQuestion.save();
        res.redirect('/ask_bros');
    } catch (err) {
        console.error(err);
        res.send('Error saving question');
    }
});

// Question detail page
router.get('/question/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const answers = await Answer.find({ questionId: req.params.id }).sort({ createdAt: 1 });
        res.render('question', { question, answers });
    } catch (err) {
        console.error(err);
        res.send('Error fetching question');
    }
});

// Post an answer
router.post('/question/:id/answer', async (req, res) => {
    try {
        const newAnswer = new Answer({
            questionId: req.params.id,
            answer: req.body.answer
        });
        await newAnswer.save();
        res.redirect(`/question/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.send('Error saving answer');
    }
});

module.exports = router;