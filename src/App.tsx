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
import { Route, Routes } from 'react-router-dom';

import { useAuth } from './auth/AuthContext';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { db } from './firebase';
import { RecruiterType, Template } from './interface';
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
  const [lastRecruiter, setLastRecruiter] = useState<DocumentData>();

  useEffect(() => {
    if (currentUser?.emailVerified === true) {
      const getTemplates = async () => {
        setTemplatesLoading(true);
        const q = query(collection(db, 'templates'), where('user', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setTemplates((current) => [...current, doc.data() as Template]);
        });
        setTemplatesLoading(false);
      };

      const getRecruiters = async () => {
        setRecruitersLoading(true);
        // Get last recruiter
        const lastRecruiterQuery = query(collection(db, 'recruiters'), orderBy('dateAddedMillis'), limit(1));
        const lastRecruiter = await getDocs(lastRecruiterQuery);
        lastRecruiter.forEach((recruiter) => setLastRecruiter(recruiter.data()));

        const q = query(collection(db, 'recruiters'), orderBy('dateAddedMillis', 'desc'), limit(RECRUITERS_PER_PAGE));
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
              seenBy: recruiter.seenBy,
              dateAddedMillis: recruiter.dateAddedMillis,
              addedBy: recruiter.addedBy,
            },
          ]);
        });
        setRecruiters((oldRecruiters) =>
          oldRecruiters.sort((a, b) => {
            if (a.seenBy.includes(currentUser.uid) && !b.seenBy.includes(currentUser.uid)) {
              return 1;
            } else if (b.seenBy.includes(currentUser.uid) && !a.seenBy.includes(currentUser.uid)) {
              return -1;
            } else return a.dateAddedMillis < b.dateAddedMillis ? 1 : -1;
          })
        );
        setRecruitersLoading(false);
      };

      getRecruiters().catch((e) => {
        alert('There was an error, try again');
        console.log(e);
      });
      getTemplates().catch((e) => {
        alert('There was an error, try again');
        console.log(e);
      });
    }
  }, [currentUser]);

  const fetchMore = async () => {
    if (currentUser) {
      setMoreRecruitersLoading(true);
      const q = query(
        collection(db, 'recruiters'),
        orderBy('dateAddedMillis', 'desc'),
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
            seenBy: recruiter.seenBy,
            dateAddedMillis: recruiter.dateAddedMillis,
            addedBy: recruiter.addedBy,
          },
        ]);
      });
      setRecruiters((oldRecruiters) =>
        oldRecruiters.sort((a, b) => {
          const aIncludesUser = a.seenBy.includes(currentUser.uid);
          const bIncludesUser = b.seenBy.includes(currentUser.uid);

          if (aIncludesUser && !bIncludesUser) {
            return 1;
          } else if (bIncludesUser && !aIncludesUser) {
            return -1;
          } else return a.dateAddedMillis < b.dateAddedMillis ? 1 : -1;
        })
      );
      setMoreRecruitersLoading(false);
    }
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
                lastRecruiter={lastRecruiter}
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
        {currentUser?.emailVerified ? <Footer /> : <></>}
      </div>
    </div>
  );
};

export default App;
