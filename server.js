const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const { ensureAuthenticated } = require('./middleware/auth');
const flashMiddleware = require('./middleware/flashMiddleware'); // Import custom flash middleware
const { QueryTypes } = require('sequelize');
const MySQLStore = require('connect-mysql')(session);
const mysql = require('mysql2');

const app = express();
const PORT = process.env.MYSQLPORT || 8080;
// MySQL database connection
const dbConnection = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

// Session store setup
const sessionStore = new MySQLStore({
    config: {
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSERE,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE
    }
});
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Use custom flash middleware
app.use(flashMiddleware);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global middleware for flash messages and user info
app.use((req, res, next) => {
    res.locals.success_msg = req.flash.success_msg;
    res.locals.error_msg = req.flash.error_msg;
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
            req.flash.error_msg = 'Error fetching jobs';
            return res.redirect('/profile');
        }
        res.render('profile', { user: req.user, jobs });
    });
});

app.get('/jobs', ensureAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, results) => {
        if (err) {
            req.flash.error_msg = 'Error fetching jobs';
            return res.redirect('/');
        }
        res.render('jobs', { jobs: results });
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
