const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    askedquestions: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);