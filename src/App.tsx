import './App.css';

import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './auth/AuthContext';
import Header from './components/Header/Header';
import { db } from './firebase';
import { RecruiterType, Template } from './interface';
import Companies from './pages/Companies/Companies';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import SignUp from './pages/SignUp/SignUp';
import Templates from './pages/Templates/Templates';

const App = () => {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);
  const [recruitersLoading, setRecruitersLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      const getTemplates = async () => {
        console.log('fetching templates');
        setTemplatesLoading(true);
        const q = query(collection(db, 'templates'), where('user', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setTemplates((current) => [...current, doc.data() as Template]);
        });
        setTemplatesLoading(false);
      };

      const getRecruiters = async () => {
        console.log('fetching recruiters from firebase');
        setRecruitersLoading(true);
        const q = query(collection(db, 'recruiters'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const recruiter = doc.data();
          setRecruiters((oldArray) => [
            ...oldArray,
            {
              id: recruiter.id,
              firstName: recruiter.firstName,
              lastName: recruiter.lastName,
              email: recruiter.email,
              company: recruiter.company,
              title: recruiter.title,
              linkedIn: recruiter.linkedIn,
            },
          ]);
        });
        setRecruitersLoading(false);
      };

      getRecruiters().catch((e) => console.log(JSON.stringify(e)));
      getTemplates().catch((e) => console.log(JSON.stringify(e)));
    }
  }, [currentUser]);

  const authenticatedRoutes = currentUser ? (
    <>
      <Route
        path="/home"
        element={<Home templates={templates} recruiters={recruiters} setRecruiters={setRecruiters} loading={recruitersLoading}/>}
      />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/templates"
        element={<Templates userTemplates={templates} setUserTemplates={setTemplates} loading={templatesLoading} />}
      />
      {/* TODO: Remove */}
      <Route path="/companies" element={<Companies />} />
    </>
  ) : (
    <>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/profile" element={<Navigate to="/login" replace />} />
    </>
  );

  return (
    <div className="app">
      <div className="app-content">
        <Header isLoggedIn={currentUser !== undefined} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {authenticatedRoutes}
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
