const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    askedquestions: String,
    username: { type: String, default: 'Anonymous' },
    class: { type: String, default: '' },
    language: { type: String, default: '' },
    assessment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);