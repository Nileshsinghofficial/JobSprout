const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

// Profile route
router.get('/profile', ensureAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, jobs) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/');
        }
        res.render('profile', { user: req.user, jobs });
    });
});

// Apply for job route
router.post('/apply', ensureAuthenticated, (req, res) => {
    const { jobId } = req.body;
    const userId = req.user.id;

    const sql = 'INSERT INTO applications (user_id, job_id) VALUES (?, ?)';
    db.query(sql, [userId, jobId], (err, result) => {
        if (err) {
            console.error('Error applying for job:', err);
            req.flash('error_msg', 'Error applying for job');
            return res.redirect('/profile');
        }
        req.flash('success_msg', 'Successfully applied for job');
        res.redirect('/profile');
    });
});

module.exports = router;
