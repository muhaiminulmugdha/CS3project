const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/User');
const devEmails = require('../../config/devEmail');
const requireLogin = require('../../middleware/auth');

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

module.exports = router;