const express = require('express');
const router = express.Router();
const sequelize = require('../config/db'); // Adjust the path as needed
const { QueryTypes } = require('sequelize');
const { ensureAuthenticated } = require('../middleware/auth');

// Apply for a job
router.post('/apply', ensureAuthenticated, async (req, res) => {
    const { jobId } = req.body;
    const userId = req.user.id;

    try {
        await sequelize.query(
            'INSERT INTO applications (user_id, job_id) VALUES (:userId, :jobId)', 
            {
                replacements: { userId, jobId },
                type: QueryTypes.INSERT
            }
        );
        res.send('Application successful');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

// View applications
router.get('/applications', ensureAuthenticated, async (req, res) => {
    try {
        const applications = await sequelize.query(
            'SELECT jobs.title, jobs.company, jobs.location, applications.applied_at FROM applications ' +
            'JOIN jobs ON applications.job_id = jobs.id ' +
            'WHERE applications.user_id = :userId', 
            {
                replacements: { userId: req.user.id },
                type: QueryTypes.SELECT
            }
        );
        res.json(applications);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
