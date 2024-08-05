const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const passport = require('passport'); 
const db = require('./config/db');
require('./config/passport');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/user');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET, // Use environment variable for session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global middleware for flash messages and user/admin info
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    res.locals.admin = req.session.admin || null;
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
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const jobsSql = 'SELECT * FROM jobs';
    db.query(jobsSql, (err, jobs) => {
        if (err) {
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/profile');
        }

        res.render('profile', { user: req.session.user, jobs });
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
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/admin-dashboard', (req, res) => {
    if (!req.session.admin) {
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