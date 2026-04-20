const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Start Google OAuth
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login?error=unauthorized',
        failureMessage: true
    }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('/login?error=unauthorized');
        }

        // Check ban
        if (req.user.banned) {
            return res.redirect('/login?error=banned');
        }

        // Set session user
        req.session.user = {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            banned: req.user.banned
        };
        res.redirect('/ask_bros');
    }
);

module.exports = router;