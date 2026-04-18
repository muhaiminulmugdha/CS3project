const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const requireLogin = require('../middleware/auth');

router.get('/ask_bros', requireLogin, async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.render('ask_bros', { questions, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error fetching questions');
    }
});

router.post('/ask-question', requireLogin, async (req, res) => {
    try {
        const newQuestion = new Question({ 
            askedquestions: req.body.ask_question,
            username: req.session.user.username
        });
        await newQuestion.save();
        res.redirect('/ask_bros');
    } catch (err) {
        console.error(err);
        res.send('Error saving question');
    }
});

router.get('/question/:id', requireLogin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const answers = await Answer.find({ questionId: req.params.id }).sort({ createdAt: 1 });
        res.render('question', { question, answers, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error fetching question');
    }
});

router.post('/question/:id/answer', requireLogin, async (req, res) => {
    try {
        const newAnswer = new Answer({
            questionId: req.params.id,
            answer: req.body.answer,
            username: req.session.user.username
        });
        await newAnswer.save();
        res.redirect(`/question/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.send('Error saving answer');
    }
});

module.exports = router;