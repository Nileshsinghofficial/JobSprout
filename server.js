const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { ensureAuthenticated } = require('./middleware/auth'); // Ensure this import is correct

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global middleware for flash messages and user info
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', jobRoutes);

app.get('/admin-login', (req, res) => {
    res.render('admin-login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    const jobsSql = 'SELECT * FROM jobs';
    db.query(jobsSql, (err, jobs) => {
        if (err) {
            req.flash('error_msg', 'Error fetching jobs');
            return res.redirect('/profile');
        }
        res.render('profile', { user: req.user, jobs });
    });
});

app.get('/jobs', ensureAuthenticated, (req, res) => {
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
    const authToken = req.cookies['authToken'];
    if (authToken && users[authToken]) {
        res.json({ loggedIn: true, username: users[authToken].username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/admin-dashboard', ensureAuthenticated, (req, res) => {
    if (!req.user.isAdmin) {
        return res.redirect('/admin-login');
    }
    res.render('admin-dashboard');
});

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
