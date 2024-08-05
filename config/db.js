require('dotenv').config(); // Ensure environment variables are loaded

const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // Use local host
    user: process.env.DB_USERNAME,    // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DATABASE,   // Database name
    port: process.env.DB_PORT          // Database port
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
