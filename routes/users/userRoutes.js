const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/User');
const devEmails = require('../../config/devEmail');
const requireLogin = require('../../middleware/auth');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');

// Signup route
router.post('/api/v1/users/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render('signup', { error: 'All fields are required', username, email });
    }

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.render('signup', { error: 'Email already exists', username, email });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.render('signup', { error: 'Username already taken, please choose another', username, email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = devEmails.includes(email) ? 'teacher' : 'student';
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/api/v1/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'Please enter email and password', email });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password', email });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.user = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            };
            res.redirect('/ask_bros');
        } else {
            res.render('login', { error: 'Invalid email or password', email });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Account page
router.get('/account', requireLogin, async (req, res) => {
    res.render('account', { user: req.session.user, error: null, success: null });
});

// Change username
router.post('/account/username', requireLogin, async (req, res) => {
    try {
        const { username } = req.body;
        await User.findByIdAndUpdate(req.session.user._id, { username });
        req.session.user.username = username;
        res.render('account', { user: req.session.user, success: 'Username updated successfully!', error: null });
    } catch (err) {
        console.error(err);
        res.render('account', { user: req.session.user, error: 'Error updating username', success: null });
    }
});

// Change password
router.post('/account/password', requireLogin, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.render('account', { user: req.session.user, error: 'New passwords do not match', success: null });
        }

        const user = await User.findById(req.session.user._id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.render('account', { user: req.session.user, error: 'Current password is incorrect', success: null });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.session.user._id, { password: hashedPassword });
        res.render('account', { user: req.session.user, success: 'Password updated successfully!', error: null });
    } catch (err) {
        console.error(err);
        res.render('account', { user: req.session.user, error: 'Error updating password', success: null });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

router.post('/account/delete', requireLogin, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const username = req.session.user.username;

        // Handle questions
        const questions = await Question.find({ username });
        for (const question of questions) {
            const answerCount = await Answer.countDocuments({ questionId: question._id });
            if (answerCount === 0) {
                // No answers — delete the question
                await Question.findByIdAndDelete(question._id);
            } else {
                // Has answers — keep but anonymize
                await Question.findByIdAndUpdate(question._id, { username: 'Deleted User' });
            }
        }

        // Anonymize their answers (keep them but remove username)
        await Answer.updateMany({ username }, { username: 'Deleted User' });

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Destroy session
        req.session.destroy();
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.send('Error deleting account');
    }
});

// Profile page
router.get('/profile/:username', requireLogin, async (req, res) => {
    try {
        const profileUser = await User.findOne({ username: req.params.username });
        if (!profileUser) {
            return res.status(404).send('User not found');
        }

        const questions = await Question.find({ username: req.params.username }).sort({ createdAt: -1 });
        const answers = await Answer.find({ username: req.params.username }).sort({ createdAt: -1 });

        res.render('profile', {
            user: req.session.user,
            profileUser,
            questions,
            answers
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading profile');
    }
});

// Leaderboard
router.get('/leaderboard', requireLogin, async (req, res) => {
    try {
        const users = await User.find({ banned: false }).select('username role createdAt');
        
        const leaderboard = await Promise.all(users.map(async (u) => {
            const answerCount = await Answer.countDocuments({ username: u.username });
            const questions = await Question.countDocuments({ username: u.username });
            
            // Get total upvotes received
            const answers = await Answer.find({ username: u.username });
            const totalUpvotes = answers.reduce((sum, a) => sum + (a.upvotes || 0), 0);
            
            return {
                username: u.username,
                role: u.role,
                answerCount,
                questions,
                totalUpvotes,
                score: (answerCount * 10) + (totalUpvotes * 5) + (questions * 2)
            };
        }));

        // Sort by score
        leaderboard.sort((a, b) => b.score - a.score);

        res.render('leaderboard', { user: req.session.user, leaderboard });
    } catch (err) {
        console.error(err);
        res.send('Error loading leaderboard');
    }
});
module.exports = router;