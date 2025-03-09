import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar'; // Ensure this path is correct
import Footer from './components/Footer'; // Ensure this path is correct
import OAuthSuccess from './components/OAuthSuccess'; // Import OAuthSuccess component
import { UserProvider, UserContext } from './userContext'; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];

  return (
    <div className="App">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="App-content">
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/success" element={<OAuthSuccess />} /> {/* Add OAuthSuccess route */}
        </Routes>
      </div>
      {!hideNavbarPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

export default App;
