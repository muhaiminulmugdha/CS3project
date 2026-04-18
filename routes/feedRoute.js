const express = require('express');
const pool = require('../config/db.js');
const router = express.Router();

router.get('/', (req, res) => {
    pool.query("SELECT * FROM questions", (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).send('Database query error');
        } else {
            res.render('help_bros', { questions: results });
        }
    });
});

router.get('/help_bros', (req, res) => {
    res.render('help_bros');
});

router.get('/help_bros', (req, res) => {
    // Perform a database query to retrieve the questions
    pool.query("SELECT * FROM questions", (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send('Database query error'); // Send error message if database query fails
        }

        // Render the 'help_bros' view and pass the questions data to it
        res.render('help_bros', { questions: results });
    });
});


module.exports = router;
