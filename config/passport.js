const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const devEmails = require('./devEmail');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
        ? 'https://falconflow-f30q.onrender.com/auth/google/callback'
        : 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        const isDevEmail = devEmails.includes(email);
        const isCpsdEmail = email.endsWith('@cpsd.us');

        if (!isDevEmail && !isCpsdEmail) {
            return done(null, false, { message: 'Only @cpsd.us emails are allowed' });
        }

        let user = await User.findOne({ email });

        if (user) {
            if (!isDevEmail && !isCpsdEmail) {
                return done(null, false, { message: 'Only @cpsd.us emails are allowed' });
            }
            return done(null, user);
        }

        const role = isDevEmail ? 'teacher' : 'student';
        const username = profile.displayName.replace(/\s+/g, '').toLowerCase();

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