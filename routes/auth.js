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
                // Handle successful login
                req.session.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
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
