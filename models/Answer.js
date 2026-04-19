const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    answer: { type: String, required: true },
    username: { type: String, default: 'Anonymous' },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{ 
        username: String, 
        vote: String  // 'up' or 'down'
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);