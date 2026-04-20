const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const devEmails = require('./devEmail');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // Check if email is allowed
        const isDevEmail = devEmails.includes(email);
        const isCpsdEmail = email.endsWith('@cpsd.us');

        if (!isDevEmail && !isCpsdEmail) {
            return done(null, false, { message: 'Only @cpsd.us emails are allowed' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // Still check if email is allowed even for existing users
            if (!isDevEmail && !isCpsdEmail) {
                return done(null, false, { message: 'Only @cpsd.us emails are allowed' });
            }
            return done(null, user);
        }

        // Create new user
        const role = isDevEmail ? 'teacher' : 'student';
        const username = profile.displayName.replace(/\s+/g, '').toLowerCase();

        // Make sure username is unique
        let finalUsername = username;
        let count = 1;
        while (await User.findOne({ username: finalUsername })) {
            finalUsername = `${username}${count}`;
            count++;
        }

        user = new User({
            username: finalUsername,
            email,
            password: 'google-oauth',
            role,
            googleId: profile.id
        });

        await user.save();
        return done(null, user);

    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;