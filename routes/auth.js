const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            req.flash('error_msg', 'An error occurred');
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

        // Generate and set token for authentication
        const authToken = crypto.randomBytes(30).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

        // Store the token in the database
        await Token.create({
            token: authToken,
            user_id: user.id,
            expires_at: expiresAt
        });

        res.cookie('authToken', authToken, { httpOnly: true });
        res.redirect('/profile');
    });
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
});

module.exports = router;
