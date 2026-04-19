const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.banned) {
            req.session.destroy();
            return res.redirect('/login?banned=true');
        }
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = requireLogin;