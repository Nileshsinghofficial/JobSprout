const { Sequelize } = require('sequelize');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

// Create a connection to the railway MySQL database
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
        rejectUnauthorized: false
    },
    connectTimeout: 10000 // 10 seconds
});

// // Create a connection to the local MySQL database
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DATABASE,
//     port: process.env.DB_PORT,
//     ssl: {
//         ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
//         rejectUnauthorized: false
//     },
//     connectTimeout: 10000 // 10 seconds
// });

// Handle connection errors
// db.on('error', (err) => {
//     console.error('Database error:', err);
// });

// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('Database connection error:', err);
//         return;
//     }
//     console.log('Connected to the MySQL server.');
// });
sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL server.'))
    .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;