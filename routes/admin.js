const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../middleware/auth');

// Route to render admin registration page
router.get('/admin-register', (req, res) => {
    res.render('admin-register');
});

// Admin registration route
router.post('/admin-register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const checkAdminSql = 'SELECT * FROM admins WHERE username = ?';
        db.query(checkAdminSql, [username], async (err, results) => {
            if (err) {
                req.flash('error_msg', 'Error checking username availability');
                return res.redirect('/admin/admin-register');
            }

            if (results.length > 0) {
                req.flash('error_msg', 'Username already exists');
                return res.redirect('/admin/admin-register');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO admins (username, password) VALUES (?, ?)';
            db.query(sql, [username, hashedPassword], (err, result) => {
                if (err) {
                    req.flash('error_msg', 'Error registering admin');
                    return res.redirect('/admin/admin-register');
                }
                req.flash('success_msg', 'Successfully registered');
                res.redirect('/admin/admin-login');
            });
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during registration');
        res.redirect('/admin/admin-register');
    }
});

// Admin login route
router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM admins WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            req.flash('error_msg', 'An error occurred');
            return res.redirect('/admin-login');
        }
        if (results.length === 0) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/admin-login');
        }

        const admin = results[0];
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/admin-login');
        }

        // Generate and set token for authentication
        const authToken = crypto.randomBytes(30).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

        // Store the token in the database
        await Token.create({
            token: authToken,
            user_id: admin.id,
            expires_at: expiresAt
        });

        res.cookie('authToken', authToken, { httpOnly: true });
        res.redirect('/admin-dashboard');
    });
});

// Admin dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/admin/dashboard');
        }
        res.render('admin-dashboard', { jobs: results });
    });
});

// Add Job route
router.post('/add-job', ensureAuthenticated, (req, res) => {
    const { title, description, author } = req.body;
    const sql = 'INSERT INTO jobs (title, description, author) VALUES (?, ?, ?)';
    db.query(sql, [title, description, author], (err, result) => {
        if (err) {
            console.error('Error adding job:', err);
            req.flash('error_msg', 'Error adding job');
            return res.redirect('/admin/dashboard');
        }
        req.flash('success_msg', 'Job added successfully');
        res.redirect('/admin/dashboard');
    });
});

// Edit Job route
router.get('/edit-job/:id', ensureAuthenticated, (req, res) => {
    const jobId = req.params.id;
    const sql = 'SELECT * FROM jobs WHERE id = ?';
    db.query(sql, [jobId], (err, results) => {
        if (err) {
            console.error('Error fetching job:', err);
            req.flash('error_msg', 'Error fetching job details');
            return res.redirect('/admin/dashboard');
        }
        const job = results[0];
        res.render('edit-job', { job });
    });
});

router.post('/edit-job/:id', ensureAuthenticated, (req, res) => {
    const jobId = req.params.id;
    const { title, description, author } = req.body;
    const sql = 'UPDATE jobs SET title = ?, description = ?, author = ? WHERE id = ?';
    db.query(sql, [title, description, author, jobId], (err, result) => {
        if (err) {
            console.error('Error editing job:', err);
            req.flash('error_msg', 'Error editing job');
            return res.redirect('/admin/dashboard');
        }
        req.flash('success_msg', 'Job edited successfully');
        res.redirect('/admin/dashboard');
    });
});

// Delete Job route
router.get('/delete-job/:id', ensureAuthenticated, (req, res) => {
    const jobId = req.params.id;
    const sql = 'DELETE FROM jobs WHERE id = ?';
    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error deleting job:', err);
            req.flash('error_msg', 'Error deleting job');
            return res.redirect('/admin/dashboard');
        }
        req.flash('success_msg', 'Job deleted successfully');
        res.redirect('/admin/dashboard');
    });
});

module.exports = router;
