import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext({
    user: null,
    setUser: () => {},
    logout: () => {}
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const updateUserData = (userInfo) => {
        setUser(userInfo);
    };

    const logout = () => {
        setUser(null);
    };

    const contextValue = {
        user,
        setUser: updateUserData,
        logout
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext };
export default UserContext;