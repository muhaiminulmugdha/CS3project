const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const requireLogin = require('../middleware/auth');

router.get('/help_bros', requireLogin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'newest';

        // Sort options
        let sortQuery = { createdAt: -1 }; // default newest
        if (sort === 'oldest') sortQuery = { createdAt: 1 };

        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / limit);

        let questions = await Question.find()
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const questionsWithCounts = await Promise.all(questions.map(async (q) => {
            const answerCount = await Answer.countDocuments({ questionId: q._id });
            return { ...q.toObject(), answerCount };
        }));

        // Sort by most answered or most voted after fetching
        if (sort === 'most-answered') {
            questionsWithCounts.sort((a, b) => b.answerCount - a.answerCount);
        }

        // Count total unanswered
        const allQuestions = await Question.find();
        let unansweredCount = 0;
        for (const q of allQuestions) {
            const count = await Answer.countDocuments({ questionId: q._id });
            if (count === 0) unansweredCount++;
        }

        res.render('help_bros', {
            questions: questionsWithCounts,
            user: req.session.user,
            currentPage: page,
            totalPages,
            totalQuestions,
            unansweredCount,
            currentSort: sort
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading page');
    }
});

module.exports = router;