const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const requireLogin = require('../middleware/auth');
const teacherOnly = require('../middleware/teacherOnly');

// Teacher dashboard
router.get('/dashboard', requireLogin, teacherOnly, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        const questions = await Question.find().sort({ createdAt: -1 });
        const answers = await Answer.find();

        res.render('dashboard', {
            user: req.session.user,
            users,
            questions,
            totalAnswers: answers.length
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
});

// Ban/unban user
router.post('/dashboard/ban/:id', requireLogin, teacherOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.banned = !user.banned;
        await user.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error updating user');
    }
});

// Promote student to teacher
router.post('/dashboard/promote/:id', requireLogin, teacherOnly, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: 'teacher' });
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error promoting user');
    }
});

// Delete any question
router.post('/dashboard/question/:id/delete', requireLogin, teacherOnly, async (req, res) => {
    try {
        await Answer.deleteMany({ questionId: req.params.id });
        await Question.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error deleting question');
    }
});

// Delete any answer
router.post('/dashboard/answer/:id/delete', requireLogin, teacherOnly, async (req, res) => {
    try {
        await Answer.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error deleting answer');
    }
});

module.exports = router;