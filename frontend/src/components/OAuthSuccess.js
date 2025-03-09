import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext'; // Ensure this path is correct

const OAuthSuccess = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        const username = params.get('username');
        const id = params.get('id');

        if (email && username && id) {
            const userData = { email, username, id };
            localStorage.setItem("user", JSON.stringify(userData)); // Save user data in local storage
            setUser(userData); // Update user context
            navigate('/home'); // Redirect to users page
        } else {
            navigate('/home');
        }
    }, [navigate, setUser]);

    return <div>Loading...</div>;
};

export default OAuthSuccess;