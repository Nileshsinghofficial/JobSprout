const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db'); // Ensure this is set up to interact with your PostgreSQL database
const { ensureAuthenticated } = require('../middleware/auth');

// EnsureAuthenticated middleware
module.exports.ensureAuthenticated = async (req, res, next) => {
    const authToken = req.cookies['authToken'];
    if (authToken) {
        try {
            // Check if the token exists and is not expired
            const tokenSql = 'SELECT * FROM tokens WHERE token = ? AND expires_at > NOW()';
            db.query(tokenSql, [authToken], (err, results) => {
                if (err || results.length === 0) {
                    req.flash('error_msg', 'Invalid or expired token');
                    return res.redirect('/login');
                }

                // Fetch the associated user
                const userSql = 'SELECT * FROM users WHERE id = ?';
                db.query(userSql, [results[0].user_id], (err, userResults) => {
                    if (err || userResults.length === 0) {
                        req.flash('error_msg', 'User not found');
                        return res.redirect('/login');
                    }
                    req.user = userResults[0];
                    return next();
                });
            });
        } catch (err) {
            console.error('Error checking authentication:', err);
            req.flash('error_msg', 'An error occurred');
            res.redirect('/login');
        }
    } else {
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/login');
    }
};

// Route to render register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register route
router.post('/register', async (req, res) => {
    const { username, password, confirmPassword, checkbox } = req.body;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/register');
    }

    try {
        // Check if username already exists
        const checkUserSql = 'SELECT * FROM users WHERE username = ?';
        db.query(checkUserSql, [username], async (err, results) => {
            if (err) {
                console.error('Error checking username availability:', err);
                req.flash('error_msg', 'Error checking username availability');
                return res.redirect('/register');
            }

            if (results.length > 0) {
                req.flash('error_msg', 'Username already taken');
                return res.redirect('/register');
            }

            // If username is available, hash the password and insert the new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO users (username, password, checkbox) VALUES (?, ?, ?)';
            db.query(sql, [username, hashedPassword, checkbox ? 1 : 0], (err) => {
                if (err) {
                    console.error('Error registering user:', err);
                    req.flash('error_msg', 'Error registering user');
                    return res.redirect('/register');
                }
                req.flash('success_msg', 'Successfully registered');
                res.redirect('/login');
            });
        });
    } catch (err) {
        console.error('An error occurred during registration:', err);
        req.flash('error_msg', 'An error occurred during registration');
        res.redirect('/register');
    }
});

// Route to render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Fetch user from the database
    const userSql = 'SELECT * FROM users WHERE username = ?';
    db.query(userSql, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            req.flash('error_msg', 'Error fetching user');
            return res.redirect('/login');
        }

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/login');
        }

        const user = results[0];
        const authToken = crypto.randomBytes(30).toString('hex');

        // Store the token in the database
        const tokenSql = 'INSERT INTO tokens (token, user_id, expires_at) VALUES (?, ?, ?)';
        const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
        db.query(tokenSql, [authToken, user.id, expiresAt], (err) => {
            if (err) {
                console.error('Error storing token:', err);
                req.flash('error_msg', 'Error logging in');
                return res.redirect('/login');
            }
            res.cookie('authToken', authToken, { httpOnly: true });
            if (user.isAdmin) {
                return res.redirect('/admin-dashboard');
            }
            res.redirect('/profile');
        });
    });
});

// Route to render profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
    const jobsSql = 'SELECT * FROM jobs';
    db.query(jobsSql, (err, jobs) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/');
        }
        res.render('profile', { user: req.user, jobs });
    });
});

// Logout route
router.get('/logout', async (req, res) => {
    const authToken = req.cookies['authToken'];
    if (authToken) {
        // Remove token from the database
        const deleteTokenSql = 'DELETE FROM sessions WHERE session_Id = ?';
        db.query(deleteTokenSql, [authToken], (err) => {
            if (err) {
                console.error('Error deleting token:', err);
                req.flash('error_msg', 'Error logging out');
                return res.redirect('/profile');
            }
            res.clearCookie('authToken');
            req.flash('success_msg', 'You are logged out');
            res.redirect('/login');
        });
    } else {
        req.flash('error_msg', 'No token found');
        res.redirect('/login');
    }
});

module.exports = router;
