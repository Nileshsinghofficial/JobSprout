const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

const users = {}; // Simulating a simple in-memory user store. Replace with your user fetching logic.

// EnsureAuthenticated middleware
module.exports.ensureAuthenticated = (req, res, next) => {
    const authToken = req.cookies['authToken'];
    if (authToken && users[authToken]) {
        req.user = users[authToken];
        return next();
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
            db.query(sql, [username, hashedPassword, checkbox ? 1 : 0], (err, result) => {
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
        users[authToken] = { id: user.id, username: user.username, isAdmin: user.isAdmin };
        
        res.cookie('authToken', authToken, { httpOnly: true });
        if (user.isAdmin) {
            return res.redirect('/admin-dashboard');
        }
        res.redirect('/profile');
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
router.get('/logout', (req, res) => {
    const authToken = req.cookies['authToken'];
    if (authToken) {
        delete users[authToken];
        res.clearCookie('authToken');
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

module.exports = router;
