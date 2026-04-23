const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const requireLogin = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/api/ai/similar-questions', requireLogin, async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length < 10) {
            return res.json({ similar: [] });
        }

        const allQuestions = await Question.find().sort({ createdAt: -1 }).limit(100);

        if (allQuestions.length === 0) {
            return res.json({ similar: [] });
        }

        const questionsList = allQuestions.map((q, i) =>
            `${i + 1}. ID:${q._id} | ${q.askedquestions}`
        ).join('\n');

        const prompt = `A student is about to post this question: "${question}"

Here are existing questions in the database:
${questionsList}

Find the top 3 most similar existing questions to what the student is asking. Only return questions that are genuinely similar in topic or meaning.

Respond ONLY with a JSON array of IDs like this (no other text):
["id1", "id2", "id3"]

If no questions are similar, respond with: []`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const text = response.text.trim();
        const ids = JSON.parse(text);

        const similar = allQuestions.filter(q =>
            ids.includes(q._id.toString())
        ).map(q => ({
            _id: q._id,
            askedquestions: q.askedquestions,
            username: q.username,
            class: q.class,
            language: q.language
        }));

        res.json({ similar });

    } catch (err) {
        console.error('AI error:', err);
        res.json({ similar: [] });
    }
});

module.exports = router;