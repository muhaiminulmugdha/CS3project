const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const requireLogin = require('../middleware/auth');

router.get('/help_bros', requireLogin, async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        
        // Get answer count for each question
        const questionsWithCounts = await Promise.all(questions.map(async (q) => {
            const answerCount = await Answer.countDocuments({ questionId: q._id });
            return { ...q.toObject(), answerCount };
        }));

        res.render('help_bros', { questions: questionsWithCounts, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading page');
    }
});

module.exports = router;