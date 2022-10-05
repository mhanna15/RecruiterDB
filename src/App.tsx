import './App.css';

import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './auth/AuthContext';
import Header from './components/Header/Header';
import { db } from './firebase';
import { Template } from './interface';
import Companies from './pages/Companies/Companies';
import NotFound from './pages/Error/NotFound';
import LoggedInHome from './pages/Home/LoggedInHome';
import LoggedOutHome from './pages/Home/LoggedOutHome';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import SignUp from './pages/SignUp/SignUp';
import Templates from './pages/Templates/Templates';

const App = () => {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);

  const isLoggedIn = currentUser !== null;

  useEffect(() => {
    console.log('fetching templates');
    const getTemplates = async () => {
      const q = query(
        collection(db, 'templates'),
        where('user', '==', currentUser.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setTemplates((current) => [...current, doc.data() as Template]);
      });
    };
    getTemplates().catch((e) => console.log(JSON.stringify(e)));
    // setUserTemplates(['template 1 here', 'template 2 here']);
  }, []);

  const authenticatedRoutes = isLoggedIn ? (
    <>
      <Route path="/" element={<LoggedInHome templates={templates} />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/templates"
        element={
          <Templates
            userTemplates={templates}
            setUserTemplates={setTemplates}
          />
        }
      />
      {/* TODO: Remove */}
      <Route path="/companies" element={<Companies />} />
    </>
  ) : (
    <>
      <Route path="/" element={<LoggedOutHome />} />
      <Route path="/profile" element={<Navigate to="/login" replace />} />
    </>
  );

  return (
    <div className="app">
      <div className="app-content">
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {authenticatedRoutes}
          <Route path="/companies" element={<Companies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
