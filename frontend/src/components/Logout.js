import { useEffect, useContext } from 'react';
import { UserContext } from '../userContext'; // Ensure this path is correct
import { Navigate } from 'react-router-dom';

function Logout() {
    const { logout } = useContext(UserContext);

    useEffect(() => {
        logout();
        fetch("http://localhost:3001/users/logout");
    }, [logout]);

    return <Navigate replace to="/" />;
}

export default Logout;
