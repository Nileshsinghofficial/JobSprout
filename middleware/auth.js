// middleware/auth.js

function ensureAuthenticated(req, res, next) {
    if (req.user) { // Adjust based on how you are storing user info
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource.');
    res.redirect('/login');
}

module.exports = ensureAuthenticated;
