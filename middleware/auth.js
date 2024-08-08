// middleware/auth.js
module.exports = function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user;
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
};
