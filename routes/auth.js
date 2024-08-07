const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db'); // Adjust the path as needed
const { QueryTypes } = require('sequelize');
require('dotenv').config();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Execute the query with parameters
    const users = await sequelize.query('SELECT * FROM admins WHERE username = :username', {
      replacements: { username },
      type: QueryTypes.SELECT
    });

    if (users.length > 0) {
      const user = users[0];

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Handle successful login
        res.send('Login successful');
      } else {
        // Handle incorrect password
        res.status(401).send('Invalid username or password');
      }
    } else {
      // Handle user not found
      res.status(401).send('Invalid username or password');
    }

  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;