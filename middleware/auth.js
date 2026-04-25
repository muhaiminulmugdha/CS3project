const User = require('../models/User');

const requireLogin = async (req, res, next) => {
    if (req.session && req.session.user) {
        try {
            // Always check fresh from DB
            const user = await User.findById(req.session.user._id);
            if (!user || user.banned) {
                req.session.destroy();
                return res.redirect('/login?error=banned');
            }
            // Keep session in sync
            req.session.user.role = user.role;
            req.session.user.banned = user.banned;
            next();
        } catch (err) {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
};
module.exports = requireLogin;