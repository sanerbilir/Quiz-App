var QuizModel = require('../models/quizModel.js');
const QuizHistory = require('../models/quizHistory');
const { performance } = require('perf_hooks');
const euler = 2.71828; // Euler's number
const k = 0.2;

module.exports = {
    saveQuestions: async function (req, res) {
        const questions = req.body.questions.map(q => ({
            category: q.category,
            type: q.type,
            difficulty: q.difficulty,
            question: q.question,
            correct_answer: q.correct_answer,
            incorrect_answers: q.incorrect_answers
        }));

        try {
            // Clear the database
            await QuizModel.deleteMany({});

            // Add new questions
            const insertedQuestions = await QuizModel.insertMany(questions);

            return res.status(201).json(insertedQuestions);
        } catch (err) {
            console.error('Error when saving questions:', err);
            return res.status(500).json({
                message: 'Error when saving questions',
                error: err
            });
        }
    },

    getQuestions: function (req, res) {
        QuizModel.find(function (err, questions) {
            if (err) {
                console.error('Error when getting questions:', err);
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            }

            return res.json(questions);
        });
    },

    startQuestion: function (req, res) {
        const questionId = req.params.id;
        req.session.startTime = performance.now();
        req.session.questionId = questionId;
        console.log(`Started question ${questionId} at ${req.session.startTime}`);
        res.status(200).json({ message: 'Question started', questionId });
    },

    submitAnswer: function (req, res) {
        const { answer } = req.body;
        const questionId = req.session.questionId;
        const endTime = performance.now();
        const timeTaken = (endTime - req.session.startTime) / 1000; // convert to seconds
        console.log(`Ended question ${questionId} at ${endTime}, time taken: ${timeTaken}s`);

        QuizModel.findById(questionId, function (err, question) {
            if (err || !question) {
                console.error('Error when finding question:', err);
                return res.status(500).json({
                    message: 'Error when finding question.',
                    error: err
                });
            }

            const correctAnswer = question.correct_answer;
            const grade = answer === correctAnswer ? 1 : 0;
            const score = 100 * grade * Math.pow(euler, -k * timeTaken);

            console.log(`Question: ${question.question}, Correct Answer: ${correctAnswer}, User Answer: ${answer}`);
            console.log(`Grade: ${grade}, Score: ${score}, Time Taken: ${timeTaken}s`);

            res.status(200).json({ grade, score, timeTaken });
        });
    },

    finishQuiz: async function (req, res) {  // Corrected function definition
        const { username, score, date } = req.body;
        try {
            const newQuizHistory = await QuizHistory.create({
                username,
                score,
                date: new Date()
            });

            res.status(201).json(newQuizHistory);
        } catch (error) {
            console.error("Error saving quiz history:", error);
            res.status(500).json({ message: "Failed to record quiz history", error: error });
        }
    },

    getLeaderboard: async function (req, res) {
        try {
            console.log("Fetching leaderboard...");
            
            const leaderboard = await QuizHistory.find()
                .sort({ score: -1 })
                .limit(10)
                .exec();
            
            if (!leaderboard) {
                throw new Error("No leaderboard data found.");
            }
            
            const response = leaderboard.map(item => ({
                username: item.username,
                score: item.score,
                date: item.date
            }));
    
            console.log("Leaderboard data:", response);
            res.json(response);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
        }
    }
};
