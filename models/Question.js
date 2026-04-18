const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    askedquestions: String,
    username: { type: String, default: 'Anonymous' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);