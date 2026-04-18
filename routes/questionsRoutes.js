const express = require('express');
const pool = require('../config/db.js');
const router = express.Router();

// GET route to display the page for asking a question


router.get('/ask_bros', (req, res) => {
    res.render('ask_bros');
})

// router.get('/', (req, res) => {
//     pool.query("SELECT * FROM questions", (err, results) => {
//         if (err) {
//             console.error(err);
//         } else {
//             res.render('ask_bros', {questions:results});
//         }
//     });
// });






router.post('/ask-question', (req, res) => {
    const ask_q = req.body.ask_question;
    console.log(ask_q);
    try{
        pool.query("INSERT INTO questions (askedquestions) VALUES (?)",
            [ask_q], (err, results) => {
                if (err){
                    console.error(err);
                    return res.send("error inserting question")
                } else {
                    console.log("data has been added to the database!");
                    res.render('/ask_bros');
                }
            });
    } catch (error) {
        console.error(error);
    }

});

module.exports = router;
