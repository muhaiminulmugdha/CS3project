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
        const answers = await Answer.find({ questionId: req.params.id })
            .sort({ upvotes: -1, createdAt: 1 });
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

router.post('/question/:id/delete', requireLogin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        // Allow if owner OR teacher
        if (question.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('You can only delete your own questions');
        }

        await Answer.deleteMany({ questionId: req.params.id });
        await Question.findByIdAndDelete(req.params.id);
        res.redirect('/ask_bros');
    } catch (err) {
        console.error(err);
        res.send('Error deleting question');
    }
});

router.post('/answer/:id/vote', requireLogin, async (req, res) => {
    try {
        const { vote } = req.body; // 'up' or 'down'
        const username = req.session.user.username;
        const answer = await Answer.findById(req.params.id);

        // Check if user already voted
        const existingVote = answer.voters.find(v => v.username === username);

        if (existingVote) {
            if (existingVote.vote === vote) {
                // Remove vote if clicking same button
                answer.voters = answer.voters.filter(v => v.username !== username);
                if (vote === 'up') answer.upvotes--;
                else answer.downvotes--;
            } else {
                // Change vote
                existingVote.vote = vote;
                if (vote === 'up') { answer.upvotes++; answer.downvotes--; }
                else { answer.downvotes++; answer.upvotes--; }
            }
        } else {
            // New vote
            answer.voters.push({ username, vote });
            if (vote === 'up') answer.upvotes++;
            else answer.downvotes++;
        }

        await answer.save();
        res.redirect(`/question/${answer.questionId}`);
    } catch (err) {
        console.error(err);
        res.send('Error voting');
    }
});

module.exports = router;