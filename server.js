const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 8080;

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/user');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(flash());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global middleware for flash messages and user/admin info
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.cookies.user || null;
    res.locals.admin = req.cookies.admin || null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', jobRoutes);
app.use('/user', userRoutes);

app.get('/admin-login', (req, res) => {
    res.render('admin-login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', (req, res) => {
    if (!req.cookies.user) {
        return res.redirect('/login');
    }

    const jobsSql = 'SELECT * FROM jobs';
    db.query(jobsSql, (err, jobs) => {
        if (err) {
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/profile');
        }

        res.render('profile', { user: req.cookies.user, jobs });
    });
});

app.get('/jobs', (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, results) => {
        if (err) {
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/');
        }
        res.render('jobs', { jobs: results });
    });
});

app.get('/api/check-login', (req, res) => {
    if (req.cookies.user) {
        res.json({ loggedIn: true, username: req.cookies.user.username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/admin-dashboard', (req, res) => {
    if (!req.cookies.admin) {
        return res.redirect('/admin-login');
    }
    res.render('admin-dashboard');
});

// Optional: Catch-all route for 404 errors
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
