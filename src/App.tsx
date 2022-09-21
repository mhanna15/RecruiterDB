import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import LoggedInHome from './pages/Home/LoggedInHome';
import LoggedOutHome from './pages/Home/LoggedOutHome';
import Login from './pages/Login/Login';
import NotFound from './pages/Error/NotFound';
import Profile from './pages/Profile/Profile';
import SignUp from './pages/SignUp/SignUp';
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
      <div className="app-content">
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          {homeRoute}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {profileRoute}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
