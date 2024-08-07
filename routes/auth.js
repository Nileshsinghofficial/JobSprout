const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db'); // Adjust the path as needed
const { QueryTypes } = require('sequelize');
require('dotenv').config();

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await sequelize.query('INSERT INTO admins (username, password) VALUES (:username, :password)', {
            replacements: { username, password: hashedPassword },
            type: QueryTypes.INSERT
        });

        req.flash.success_msg = 'Registration successful. Please log in.';
        res.redirect('/login');
    } catch (error) {
        console.error('Database error:', error);
        req.flash.error_msg = 'Server error during registration';
        res.redirect('/register');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Execute the query with parameters
        const users = await sequelize.query('SELECT * FROM admins WHERE username = :username', {
            replacements: { username },
            type: QueryTypes.SELECT
        });

        if (users.length > 0) {
            const user = users[0];

            // Verify the password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.user = user; // Simulate setting the user in the session
                req.flash.success_msg = 'Login successful';
                res.redirect('/profile');
            } else {
                req.flash.error_msg = 'Invalid username or password';
                res.redirect('/login');
            }
        } else {
            req.flash.error_msg = 'Invalid username or password';
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        req.flash.error_msg = 'Server error during login';
        res.redirect('/login');
    }
});

module.exports = router;

// Profile route
router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}`);
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
