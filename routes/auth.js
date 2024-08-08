const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db'); // Ensure the correct path
const { QueryTypes } = require('sequelize');
require('dotenv').config();

// Registration route
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword, checkbox } = req.body;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/register');
    }

    if (!checkbox) {
        req.flash('error_msg', 'You must agree to the terms and conditions');
        return res.redirect('/register');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await sequelize.query('INSERT INTO users (username, password, email) VALUES (:username, :password, :email)', {
            replacements: { username, password: hashedPassword, email },
            type: QueryTypes.INSERT
        });
        req.flash('success_msg', 'Registration successful. Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Database error:', error);
        req.flash('error_msg', 'Server error during registration');
        res.redirect('/register');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await sequelize.query('SELECT * FROM admins WHERE username = :username', {
            replacements: { username },
            type: QueryTypes.SELECT
        });

        if (users.length > 0) {
            const user = users[0];

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.user = user;
                req.flash('success_msg', 'Login successful');
                res.redirect('/profile');
            } else {
                req.flash('error_msg', 'Invalid username or password');
                res.redirect('/login');
            }
        } else {
            req.flash('error_msg', 'Invalid username or password');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        req.flash('error_msg', 'Server error during login');
        res.redirect('/login');
    }
});

module.exports = router;
