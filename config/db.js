const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '12345678',
    database: 'jobsprout'
});

// Handle connection errors
db.on('error', (err) => {
    console.error('Database error:', err);
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});



// const username = 'admin'; // Replace with the desired admin username
// const password = 'admin'; // Replace with the desired admin password

// bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//         console.error('Error hashing password:', err);
//         db.end();
//         return;
//     }

//     const sql = 'INSERT INTO admins (username, password) VALUES (?, ?)';
//     db.query(sql, [username, hashedPassword], (err, result) => {
//         if (err) {
//             console.error('Error inserting admin:', err);
//         } else {
//             console.log('Admin inserted with hashed password.');
//         }
//         db.end();
//     });
// });


module.exports = db;