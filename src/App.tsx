import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Companies from './components/Companies';
import Header from './components/Header';
import LoggedInHome from './components/LoggedInHome';
import LoggedOutHome from './components/LoggedOutHome';
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

  const homeRoute = isLoggedIn ? (
    <Route path="/" element={<LoggedInHome />} />
  ) : (
    <Route path="/" element={<LoggedOutHome />} />
  );

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        {homeRoute}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {profileRoute}
        {/* TODO: Remove */}
        <Route path="/companies" element={<Companies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
