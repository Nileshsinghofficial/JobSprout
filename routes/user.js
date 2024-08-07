const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

// Profile page route
router.get('/profile', ensureAuthenticated, (req, res) => {
    const userId = req.session.user.id;

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

// View applied jobs
router.get('/applied-jobs', ensureAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const sql = `
        SELECT jobs.title, jobs.description 
        FROM applications 
        JOIN jobs ON applications.job_id = jobs.id 
        WHERE applications.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            req.flash('error_msg', 'Error fetching applied jobs');
            return res.redirect('/profile');
        }
        res.render('applied-jobs', { jobs: results });
    });
});

module.exports = router;
