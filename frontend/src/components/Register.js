import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!password) {
            setError('Password cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email }),
                credentials: 'include'
            });

            const userData = await response.json();
            if (!response.ok) {
                throw new Error(userData.message || 'Registration failed');
            }

            console.log('Registration Successful', userData);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration Error:', error);
            setError(error.message);  // Display any error messages
        }
    };

    return (
        <div className="login-page">
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="register-button">Register</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Register;
