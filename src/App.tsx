import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import LoggedInHome from './components/Home/LoggedInHome';
import LoggedOutHome from './components/Home/LoggedOutHome';
import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';
import Profile from './components/Profile/Profile';
import SignUp from './components/SignUp/SignUp';
import { useAuth } from './context/AuthContext';

import './App.css';

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
    <div className="app">
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        {homeRoute}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {profileRoute}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
