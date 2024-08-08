const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const ensureAuthenticated = require('./middleware/auth');
const sequelize = require('./config/db'); // Ensure this path is correct
const { QueryTypes } = require('sequelize');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up sessions and flash messages
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const jobs = await sequelize.query('SELECT * FROM jobs', {
            type: QueryTypes.SELECT
        });

        res.render('profile', {
            user: req.user,
            jobs,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Database error:', error);
        req.flash('error_msg', 'Server error fetching jobs');
        res.redirect('/');
    }
});

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
