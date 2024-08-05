require('dotenv').config(); // Ensure environment variables are loaded

const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,        // Use local host
    user: process.env.MYSQLUSER,    // Database username
    password: process.env.MYSQLPASSWORD, // Database password
    database: process.env.MYSQLDATABASE,   // Database name
    port: process.env.MYSQLPORT          
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
