const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mySqlPool = require('../../config/db');

// Login route
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body; // Get data from the form

    // Validate input
    if (!username || !email || !password) {
        return res.render('login', { error: 'Please enter both email and password', email });
    }

    try {
        // Find the user by email
        const [user] = await mySqlPool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.render('login', { error: 'Invalid email or password', email });
        }

        const userData = user[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, userData.password);

        if (isMatch) {
            req.session.user = userData;  // Store user data in session
            res.redirect('/dashboard');  // Redirect to dashboard
        } else {
            res.render('login', { error: 'Invalid email or password', email });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
        return res.render('signup', { error: 'All fields are required', username, email });
    }

    try {
        // Check if email already exists
        const [existingUser] = await mySqlPool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.render('signup', { error: 'Email already exists', username, email });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        await mySqlPool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Redirect to login page after successful signup
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



module.exports = router;
