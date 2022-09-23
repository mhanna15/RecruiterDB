import './App.css';

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './auth/AuthContext';
import Header from './components/Header/Header';
import Companies from './pages/Companies/Companies';
import NotFound from './pages/Error/NotFound';
import LoggedInHome from './pages/Home/LoggedInHome';
import LoggedOutHome from './pages/Home/LoggedOutHome';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import SignUp from './pages/SignUp/SignUp';

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
      <div className="app-content">
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
    </div>
  );
};

export default App;
