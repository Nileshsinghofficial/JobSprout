// middleware/auth.js

const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error_msg', 'Please log in to view that resource');
        return res.redirect('/login');
    }
};

module.exports = {
    ensureAuthenticated,
};
