const bcrypt = require('bcryptjs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

// // Create a connection to the MySQL database
// const urlDB = 'mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.RAILWAY_PRIVATE_DOMAIN}:3306/${process.env.MYSQL_DATABASE}'
// const db = mysql.createConnection(urlDB);



// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
        rejectUnauthorized: false
    },
    connectTimeout: 10000 // 10 seconds
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
