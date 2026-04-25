const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const requireLogin = require('../middleware/auth');

router.get('/ask_bros', requireLogin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / limit);

        const questions = await Question.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const questionsWithCounts = await Promise.all(questions.map(async (q) => {
            const answerCount = await Answer.countDocuments({ questionId: q._id });
            return { ...q.toObject(), answerCount };
        }));

        res.render('ask_bros', { 
            questions: questionsWithCounts, 
            user: req.session.user,
            currentPage: page,
            totalPages,
            totalQuestions
        });
    } catch (err) {
        console.error(err);
        res.send('Error fetching questions');
    }
});

router.post('/ask-question', requireLogin, async (req, res) => {
    try {
        if (!req.body.ask_question || req.body.ask_question.trim().length === 0) {
            return res.redirect('/ask_bros');
        }
        if (req.body.ask_question.trim().length > 1000) {
            return res.redirect('/ask_bros');
        }
        const newQuestion = new Question({
            askedquestions: req.body.ask_question.trim(),
            username: req.session.user.username,
            class: req.body.class,
            language: req.body.language,
            assessment: req.body.assessment
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
        const answers = await Answer.find({ questionId: req.params.id }).sort({ upvotes: -1, createdAt: 1 });
        res.render('question', { question, answers, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error fetching question');
    }
});

router.post('/question/:id/answer', requireLogin, async (req, res) => {
    try {
        if (!req.body.answer || req.body.answer.trim().length === 0) {
            return res.redirect(`/question/${req.params.id}`);
        }
        if (req.body.answer.trim().length > 5000) {
            return res.redirect(`/question/${req.params.id}`);
        }
        const newAnswer = new Answer({
            questionId: req.params.id,
            answer: req.body.answer.trim(),
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
        const { vote } = req.body;
        const username = req.session.user.username;
        const answer = await Answer.findById(req.params.id);
        const existingVote = answer.voters.find(v => v.username === username);
        if (existingVote) {
            if (existingVote.vote === vote) {
                answer.voters = answer.voters.filter(v => v.username !== username);
                if (vote === 'up') answer.upvotes--;
                else answer.downvotes--;
            } else {
                existingVote.vote = vote;
                if (vote === 'up') { answer.upvotes++; answer.downvotes--; }
                else { answer.downvotes++; answer.upvotes--; }
            }
        } else {
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

router.get('/question/:id/edit', requireLogin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('You can only edit your own questions');
        }
        res.render('edit_question', { question, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error loading edit page');
    }
});

router.post('/question/:id/edit', requireLogin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('You can only edit your own questions');
        }
        await Question.findByIdAndUpdate(req.params.id, { askedquestions: req.body.ask_question });
        res.redirect(`/question/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.send('Error updating question');
    }
});

router.get('/answer/:id/edit', requireLogin, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (answer.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('You can only edit your own answers');
        }
        res.render('edit_answer', { answer, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error loading edit page');
    }
});

router.post('/answer/:id/edit', requireLogin, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (answer.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('You can only edit your own answers');
        }
        await Answer.findByIdAndUpdate(req.params.id, { answer: req.body.answer });
        res.redirect(`/question/${answer.questionId}`);
    } catch (err) {
        console.error(err);
        res.send('Error updating answer');
    }
});

router.post('/answer/:id/delete', requireLogin, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (answer.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('You can only delete your own answers');
        }
        const questionId = answer.questionId;
        await Answer.findByIdAndDelete(req.params.id);
        res.redirect(`/question/${questionId}`);
    } catch (err) {
        console.error(err);
        res.send('Error deleting answer');
    }
});

// Mark best answer
router.post('/question/:id/best-answer/:answerId', requireLogin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (question.username !== req.session.user.username && req.session.user.role !== 'teacher') {
            return res.status(403).send('Only the question owner can mark the best answer');
        }

        // Toggle — if same answer clicked again, unmark it
        if (question.bestAnswer && question.bestAnswer.toString() === req.params.answerId) {
            question.bestAnswer = null;
        } else {
            question.bestAnswer = req.params.answerId;
        }

        await question.save();
        res.redirect(`/question/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.send('Error marking best answer');
    }
});

module.exports = router;