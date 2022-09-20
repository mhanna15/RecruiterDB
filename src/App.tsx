import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import NotFound from './components/NotFound';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { currentUser } = useAuth();

  const profileRoute =
    currentUser !== null ? (
      <Route path="/profile" element={<Profile />} />
    ) : (
      <Route path="/profile" element={<Navigate to="/" replace />} />
    );

  return (
    <div>
      <h1>Firebase auth and context</h1>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {profileRoute}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
