import './App.css';

import { createInMemoryCache } from '@algolia/cache-in-memory';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAuth } from './auth/AuthContext';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { db } from './firebase';
import { RecruiterType, Template } from './interface';
import NotFound from './pages/Error/NotFound';
import FAQs from './pages/FAQS/FAQS';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Templates from './pages/Templates/Templates';

export const RECRUITERS_PER_PAGE = 5;

const client = algoliasearch('37ALA4V5GX', '716b5d3ec9a5585d268ca3596c06ad62', {
  responsesCache: createInMemoryCache(),
  requestsCache: createInMemoryCache({ serializable: false }),
});
const index = client.initIndex('recruiters');

const App = () => {
  const { currentUser } = useAuth();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
  const [selectedTemplateID, setSelectedTemplateID] = useState<string>('No template');

  const [recruiters, setRecruiters] = useState<Array<Hit<RecruiterType>>>([]);
  const [recruitersLoading, setRecruitersLoading] = useState<boolean>(false);
  const [moreRecruitersLoading, setMoreRecruitersLoading] = useState<boolean>(false);
  const [totalRecruiters, setTotalRecruiters] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getRecruitersFromSearch = async (query: string, page: number) => {
    if (currentUser) {
      const res = await index.search<RecruiterType>(query, {
        hitsPerPage: 5,
        page,
      });
      setTotalRecruiters(res.nbHits);
      if (page === 0) {
        setRecruiters(res.hits);
      } else {
        setRecruiters((oldArray) => [...oldArray, ...res.hits]);
      }
      setRecruiters((oldRecruiters) =>
        oldRecruiters.sort((a, b) => {
          if (a.seenBy.includes(currentUser.uid) && !b.seenBy.includes(currentUser.uid)) {
            return 1;
          } else if (b.seenBy.includes(currentUser.uid) && !a.seenBy.includes(currentUser.uid)) {
            return -1;
          } else return a.dateAddedMillis < b.dateAddedMillis ? 1 : -1;
        })
      );
    }
  };

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
        await getRecruitersFromSearch('', 0);
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
      await getRecruitersFromSearch(searchQuery, currentPage + 1);
      setCurrentPage(currentPage + 1);
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
              index={index}
                fetchMore={fetchMore}
                templates={templates}
                selectedTemplateID={selectedTemplateID}
                setSelectedTemplateID={setSelectedTemplateID}
                loading={recruitersLoading}
                recruiters={recruiters}
                setRecruiters={setRecruiters}
                moreRecruitersLoading={moreRecruitersLoading}
                setLoading={setRecruitersLoading}
                totalRecruiters={totalRecruiters}
                setSearchQuery={setSearchQuery}
                setCurrentPage={setCurrentPage}
                getRecruitersFromSearch={getRecruitersFromSearch}
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
          {/* <Route
            path="/profile"
            element={
              <ProtectedRoute isAllowed={currentUser?.emailVerified === true} redirectPath="/">
                <Profile />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/faqs" element={<FAQs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {currentUser?.emailVerified ? <Footer /> : <></>}
      </div>
    </div>
  );
};

export default App;
