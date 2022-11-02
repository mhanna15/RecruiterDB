import './Home.css';

import { Hit } from '@algolia/client-search';
import Dialog from '@mui/material/Dialog';
import { SearchIndex } from 'algoliasearch';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import Form from '../../components/Form/Form';
import Loader from '../../components/Loader/Loader';
import RecruiterTable from '../../components/RecruiterTable/RecruiterTable';
import { RecruiterType, Template } from '../../interface';
import Landing from '../Landing/Landing';

const Home = (props: {
  index: SearchIndex;
  fetchMore: () => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  templates: Template[];
  selectedTemplateID: string;
  setSelectedTemplateID: Dispatch<SetStateAction<string>>;
  recruiters: Array<Hit<RecruiterType>>;
  setRecruiters: Dispatch<SetStateAction<Array<Hit<RecruiterType>>>>;
  moreRecruitersLoading: boolean;
  totalRecruiters: number;
  getRecruitersFromSearch: (query: string, page: number) => Promise<void>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const openURL = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return currentUser?.emailVerified ? (
    <div className="page-root">
      <div className="page-content">
        <div>
          <h1 className="page-header-title" style={{ marginBottom: '1em' }}>
            Dashboard
          </h1>
        </div>
        <button
          className="submit-button home-submit-button"
          onClick={() => {
            currentUser.role === 'admin' ? setPopUpOpen(true) : openURL('https://forms.gle/jRgrnYoAqnCrXovp6');
          }}
        >
          Add Recruiter
        </button>
        <input
          placeholder="Search for companies"
          style={{ marginTop: '1em' }}
          onChange={async (e) => {
            props.setLoading(true);
            clearTimeout(timer);
            const newTimer = setTimeout(async () => {
              props.setCurrentPage(0);
              props.setSearchQuery(e.target.value);
              await props.getRecruitersFromSearch(e.target.value, 0);
              props.setLoading(false);
            }, 300);
            setTimer(newTimer);
          }}
        />
        {props.loading ? (
          <Loader />
        ) : (
          <>
            <RecruiterTable
              index={props.index}
              recruiters={props.recruiters}
              setRecruiters={props.setRecruiters}
              templates={props.templates}
              selectedTemplateID={props.selectedTemplateID}
              setSelectedTemplateID={props.setSelectedTemplateID}
            />
            {props.moreRecruitersLoading ? (
              <div className="loader" />
            ) : (
              <>
                {props.recruiters.length !== props.totalRecruiters ? (
                  <button className="load-more" onClick={() => props.fetchMore()}>
                    Load More
                  </button>
                ) : (
                  <p className="load-more" style={{ display: 'flex', justifyContent: 'center' }}>
                    {"You've reached the bottom!"}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Dialog
        sx={{ width: 1 }}
        fullWidth={true}
        style={{ width: '100%' }}
        open={popUpOpen}
        onClose={() => setPopUpOpen(false)}
      >
        <Form setPopUpOpen={setPopUpOpen} setRecruiters={props.setRecruiters} />
      </Dialog>
    </div>
  ) : (
    <Landing />
  );
};

export default Home;
