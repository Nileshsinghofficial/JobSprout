const { Sequelize } = require('sequelize');
require('dotenv').config();
const mysql = require('mysql2');

// Create a new instance of Sequelize with your database configuration
const sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
    host: process.env.MYSQLHOST,
    dialect: 'mysql',
    port: process.env.MYSQLPORT,
    logging: false,
    connectTimeout: 10000 // 10 seconds
});

sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL server.'))
    .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
