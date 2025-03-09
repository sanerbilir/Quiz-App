import { useState, useEffect, useContext } from 'react';
import { decodeHtml } from './Utils';
import { UserContext } from '../userContext'; // Ensure this path is correct
import './Home.css'; // Ensure this path is correct

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await fetch("http://localhost:3001/users");
                const data = await res.json();
                console.log("Users data:", data); // Debugging log
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        getUsers();
    }, [user]);

    const startQuiz = async () => {
        setLoading(true);
        setMessage("");
        setFeedback("");
        setAnswered(false);
        setQuizStarted(false);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        try {
            const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
            const data = await res.json();
            const questions = data.results;

            const saveRes = await fetch("http://localhost:3001/quiz/save-questions", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions })
            });

            const savedQuestions = await saveRes.json();

            if (saveRes.status === 201) {
                setQuestions(savedQuestions);
                setQuizStarted(true);
                setMessage("Quiz questions loaded successfully.");
                await startQuestion(savedQuestions[0]._id);
            } else {
                setMessage("Error loading quiz questions.");
            }
        } catch (error) {
            setMessage("Error loading quiz questions.");
        } finally {
            setLoading(false);
        }
    };

    const startQuestion = async (questionId) => {
        try {
            await fetch(`http://localhost:3001/quiz/start-question/${questionId}`, {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`Started question ${questionId}`);
        } catch (error) {
            console.error("Failed to start question:", error);
        }
    };

    const handleAnswer = async (answer) => {
        if (answered) return;

        setSelectedAnswer(answer);
        const questionId = questions[currentQuestionIndex]._id;
        console.log(`Submitting answer for question ${questionId}`);
        try {
            const res = await fetch("http://localhost:3001/quiz/submit-answer", {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, answer })
            });

            const result = await res.json();
            console.log(result);

            const { grade, score, timeTaken } = result;

            setScore(prevScore => prevScore + score);
            setFeedback(grade === 1 ? "Correct!" : "Incorrect!");
            if (grade === 1) {
                setCorrectAnswers(prev => prev + 1);
            }
            setAnswered(true);

            setTimeout(() => {
                nextQuestion();
            }, 1000);
        } catch (error) {
            console.error("Failed to submit answer:", error);
        }
    };

    const saveQuizResults = async () => {
        const quizResult = {
            username: user ? user.username : null, 
            score: score,
        };
    
        try {
            const response = await fetch("http://localhost:3001/quiz/finish-quiz", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quizResult)
            });
            const data = await response.json();
            setMessage("Quiz results saved successfully!");
            console.log("Quiz results: ", data);
        } catch (error) {
            console.error("Failed to save quiz results: ", error);
            setMessage("Failed to save quiz results.");
        }
    };

    const nextQuestion = async () => {
        setAnswered(false);
        setSelectedAnswer(null);
        setFeedback("");
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            await startQuestion(questions[currentQuestionIndex + 1]._id);
        } else {
            await saveQuizResults();  // Save results after finishing the quiz
            setQuizStarted(false);
            setMessage(`Quiz finished! Your total score is ${score}. Correct answers: ${correctAnswers}/${questions.length}`);
        }
    };

    return (
        <div className="container">
            <div className="content">
                {user && <div className="greeting">Hello, {user.username}!</div>}
                {!quizStarted && (
                    <button className="btn btn-primary start-quiz-btn" onClick={startQuiz} disabled={loading}>
                        {loading ? "Starting..." : "Start Quiz"}
                    </button>
                )}
                {message && <p>{decodeHtml(message)}</p>}
                {quizStarted && (
                    <div className="question-container">
                        <h2>Question {currentQuestionIndex + 1}:</h2>
                        <p>{decodeHtml(questions[currentQuestionIndex].question)}</p>
                        {questions[currentQuestionIndex].incorrect_answers.concat(questions[currentQuestionIndex].correct_answer).sort().map((answer, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(answer)}
                                className={`${
                                    answered
                                        ? answer === questions[currentQuestionIndex].correct_answer
                                            ? 'correct'
                                            : answer === selectedAnswer
                                                ? 'incorrect'
                                                : ''
                                        : ''
                                } mb-3`}  // Added mb-3 class for margin-bottom
                                disabled={answered}
                            >
                                {decodeHtml(answer)}
                            </button>
                        ))}
                        {feedback && <p>{feedback}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
