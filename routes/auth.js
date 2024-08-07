const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Token, Job } = require('../models'); // Adjust the path as needed
const { ensureAuthenticated } = require('../middleware/auth');

// EnsureAuthenticated middleware
module.exports.ensureAuthenticated = async (req, res, next) => {
    const authToken = req.cookies['authToken'];
    if (authToken) {
        try {
            // Check if the token exists and is not expired
            const token = await Token.findOne({
                where: {
                    token: authToken,
                    expires_at: {
                        [Sequelize.Op.gt]: new Date()
                    }
                }
            });

            if (!token) {
                req.flash('error_msg', 'Invalid or expired token');
                return res.redirect('/login');
            }

            // Fetch the associated user
            const user = await User.findByPk(token.user_id);

            if (!user) {
                req.flash('error_msg', 'User not found');
                return res.redirect('/login');
            }

            req.user = user;
            return next();
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
        const userExists = await User.findOne({ where: { username } });

        if (userExists) {
            req.flash('error_msg', 'Username already taken');
            return res.redirect('/register');
        }

        // If username is available, hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            password: hashedPassword,
            checkbox: checkbox ? 1 : 0
        });

        req.flash('success_msg', 'Successfully registered');
        res.redirect('/login');
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

    try {
        // Fetch user from the database
        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/login');
        }

        const authToken = crypto.randomBytes(30).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

        // Store the token in the database
        await Token.create({
            token: authToken,
            user_id: user.id,
            expires_at: expiresAt
        });

        res.cookie('authToken', authToken, { httpOnly: true });

        if (user.isAdmin) {
            return res.redirect('/admin-dashboard');
        }
        res.redirect('/profile');
    } catch (err) {
        console.error('Error logging in:', err);
        req.flash('error_msg', 'Error logging in');
        res.redirect('/login');
    }
});

// Route to render profile page
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const jobs = await Job.findAll();
        res.render('profile', { user: req.user, jobs });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        req.flash('error_msg', 'Error fetching jobs');
        res.redirect('/');
    }
});

// Logout route
router.get('/logout', async (req, res) => {
    const authToken = req.cookies['authToken'];
    if (authToken) {
        try {
            // Remove token from the database
            await Token.destroy({ where: { token: authToken } });
            res.clearCookie('authToken');
            req.flash('success_msg', 'You are logged out');
            res.redirect('/login');
        } catch (err) {
            console.error('Error deleting token:', err);
            req.flash('error_msg', 'Error logging out');
            res.redirect('/profile');
        }
    } else {
        req.flash('error_msg', 'No token found');
        res.redirect('/login');
    }
});

module.exports = router;
