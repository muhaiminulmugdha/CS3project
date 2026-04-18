// const express = require('express');
// const mySqlPool = require('../config/db.js');
// const router = express.Router();
//
// // POST route to add a comment to a question
// router.post('/:question_id', (req, res) => {
//     const { user_id, body } = req.body;
//     const { question_id } = req.params;
//
//     const query = 'INSERT INTO comments (question_id, user_id, body) VALUES (?, ?, ?)';
//     mySqlPool.query(query, [question_id, user_id, body], (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send('Error posting comment');
//         }
//         res.redirect(`/comment_here/${question_id}`);  // Redirect back to the comment page
//     });
// });
//
// module.exports = router;
