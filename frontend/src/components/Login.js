import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext'; // Ensure this path is correct
import facebookIcon from '../images/facebook_icon.png';
import googleIcon from '../images/gmail_icon.png';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const userData = await response.json();
            if (!response.ok) {
                throw new Error(userData.message || 'Failed to login');
            }

            setUser(userData); // Update user context
            console.log('Login Successful', userData);
            navigate('/home'); // Redirect on success
        } catch (error) {
            console.error('Login Error:', error);
            setError(error.message);
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-page">
            <div className="form-container">
                <h1>Log In</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="login-button">Log In</button>
                    <button type="button" onClick={goToRegister} className="register-button">Don't have an account? Register</button>
                    <div>
                        <a href="http://localhost:3001/auth/google" className="social-login google">
                            <img src={googleIcon} alt="Login with Google" />
                            Login with Google
                        </a>
                        <a href="http://localhost:3001/auth/facebook" className="social-login facebook">
                            <img src={facebookIcon} alt="Login with Facebook" />
                            Login with Facebook
                        </a>
                    </div>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Login;
