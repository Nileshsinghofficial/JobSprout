const bcrypt = require('bcryptjs');

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// Handle connection errors
db.on('error', (err) => {
    console.error('Database error:', err);
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

module.exports = db;
