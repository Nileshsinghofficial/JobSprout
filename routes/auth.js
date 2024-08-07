const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');
const passport = require('passport');

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
    // Store the referrer URL in the session
    req.session.returnTo = req.headers.referer || '/';
    res.render('login');
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('An error occurred while querying the database:', err);
            req.flash('error_msg', 'An error occurred while querying the database');
            return res.redirect('/login');
        }
        if (results.length === 0) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/login');
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/login');
        }
        req.session.user = user;
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo; // Clear the returnTo session variable
        res.redirect(returnTo);
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
        res.render('profile', { user: req.session.user, jobs });
    });
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            req.flash('error_msg', 'Error logging out');
            return res.redirect('/login');
        }
        res.redirect('/');
    });
});

module.exports = router;
