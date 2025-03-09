var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var quizSchema = new Schema({
    category: String,
    type: String,
    difficulty: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String]
});

module.exports = mongoose.model('Quiz', quizSchema);
