module.exports.ensureAuthenticated = (req, res, next) => {
    const authToken = req.cookies['authToken'];
    if (authToken) {
        // Assuming you have a function to verify the token and get the user
        verifyToken(authToken)
            .then(user => {
                if (user) {
                    req.user = user;
                    next();
                } else {
                    req.flash('error_msg', 'Invalid or expired token');
                    res.redirect('/login');
                }
            })
            .catch(err => {
                console.error('Error checking authentication:', err);
                req.flash('error_msg', 'An error occurred');
                res.redirect('/login');
            });
    } else {
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/login');
    }
};

async function verifyToken(token) {
    // Implement token verification logic
    // Return the user if the token is valid, otherwise return null
}
