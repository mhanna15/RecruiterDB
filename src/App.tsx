import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { currentUser } = useAuth();
  const isLoggedIn = currentUser !== null;

  const profileRoute = isLoggedIn ? (
    <Route path="/profile" element={<Profile />} />
  ) : (
    <Route path="/profile" element={<Navigate to="/login" replace />} />
  );

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {profileRoute}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
