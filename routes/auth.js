const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
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

        // Redirect to the login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
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
                // Store user session data
                req.session.user = user;

                // Redirect to the profile page after successful login
                res.redirect('/profile');
            } else {
                // Handle incorrect password
                res.status(401).send('Invalid username or password');
            }
        } else {
            // Handle user not found
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Server error');
    }
});
// Profile route
router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}`);
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
