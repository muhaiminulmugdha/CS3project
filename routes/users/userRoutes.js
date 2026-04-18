const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/User');

// Signup route
router.post('/api/v1/users/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render('signup', { error: 'All fields are required', username, email });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'Email already exists', username, email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
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
                email: user.email
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

module.exports = router;