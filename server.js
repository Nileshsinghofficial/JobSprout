const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Flash messages setup
app.use(flash());

// Set global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
