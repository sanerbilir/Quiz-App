const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const QuizHistory = mongoose.model('quizHistory', quizHistorySchema);

module.exports = QuizHistory;