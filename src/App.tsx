import './App.css';

import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './auth/AuthContext';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { db } from './firebase';
import { RecruiterType, Template } from './interface';
import Companies from './pages/Companies/Companies';
import NotFound from './pages/Error/NotFound';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Templates from './pages/Templates/Templates';

export const RECRUITERS_PER_PAGE = 5;

const App = () => {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);
  const [recruitersLoading, setRecruitersLoading] = useState<boolean>(false);
  const [moreRecruitersLoading, setMoreRecruitersLoading] = useState<boolean>(false);
  const [lastRecruiterSeen, setLastRecruiterSeen] = useState<QueryDocumentSnapshot<DocumentData>>();

  useEffect(() => {
    if (currentUser?.emailVerified === true) {
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
        const q = query(collection(db, 'recruiters'), orderBy('firstName'), limit(RECRUITERS_PER_PAGE));
        const querySnapshot = await getDocs(q);
        setLastRecruiterSeen(querySnapshot.docs[querySnapshot.docs.length - 1]);
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

  const fetchMore = async () => {
    setMoreRecruitersLoading(true);
    console.log('fetching more recruiters');
    const q = query(
      collection(db, 'recruiters'),
      orderBy('firstName'),
      limit(RECRUITERS_PER_PAGE),
      startAfter(lastRecruiterSeen)
    );
    const querySnapshot = await getDocs(q);
    setLastRecruiterSeen(querySnapshot.docs[querySnapshot.docs.length - 1]);
    if (querySnapshot.docs[querySnapshot.docs.length - 1] === undefined) {
      setMoreRecruitersLoading(false);
      alert('No more recruiters for now!');
      return;
    }
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
    setMoreRecruitersLoading(false);
  };

  return (
    <div className="app">
      <div className="app-content">
        {currentUser?.emailVerified ? <Header /> : <></>}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                templates={templates}
                recruiters={recruiters}
                setRecruiters={setRecruiters}
                loading={recruitersLoading}
                fetchMore={fetchMore}
                lastRecruiterSeen={lastRecruiterSeen}
                moreRecruitersLoading={moreRecruitersLoading}
              />
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute isAllowed={currentUser?.emailVerified === true} redirectPath="/">
                <Templates userTemplates={templates} setUserTemplates={setTemplates} loading={templatesLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAllowed={currentUser?.emailVerified === true} redirectPath="/">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
