const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { ensureAuthenticated } = require('./middleware/auth');
const flashMiddleware = require('./middleware/flashMiddleware');
const { QueryTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flashMiddleware);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global middleware for flash messages and user info
app.use((req, res, next) => {
    res.locals.success_msg = res.locals.flash.success_msg;
    res.locals.error_msg = res.locals.flash.error_msg;
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
    sequelize.query(jobsSql, { type: QueryTypes.SELECT })
        .then(jobs => {
            res.render('profile', { user: req.user, jobs });
        })
        .catch(err => {
            req.flash('error_msg', 'Error fetching jobs');
            res.redirect('/profile');
        });
});

app.get('/jobs', ensureAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM jobs';
    sequelize.query(sql, { type: QueryTypes.SELECT })
        .then(results => {
            res.render('jobs', { jobs: results });
        })
        .catch(err => {
            req.flash('error_msg', 'Error fetching jobs');
            res.redirect('/');
        });
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
