import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  console.log(process.env);
  return (
    <AuthProvider>
      <div>
        <h1>Firebase auth and context</h1>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
