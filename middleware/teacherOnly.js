const teacherOnly = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'teacher') {
        next();
    } else {
        res.status(403).send('Access denied — teachers only');
    }
};

module.exports = teacherOnly;