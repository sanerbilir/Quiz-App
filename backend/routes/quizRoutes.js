var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quizController.js');

/*
 * POST
 */
router.post('/save-questions', quizController.saveQuestions);
router.post('/submit-answer', quizController.submitAnswer);
router.post('/start-question/:id', quizController.startQuestion);
router.post('/finish-quiz', quizController.finishQuiz);

/*
 * GET
 */
router.get('/get-questions', quizController.getQuestions);
router.get('/leaderboard', quizController.getLeaderboard);



module.exports = router;
