import './Home.css';

import Dialog from '@mui/material/Dialog';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { RECRUITERS_PER_PAGE } from '../../App';
import { useAuth } from '../../auth/AuthContext';
import Form from '../../components/Form/Form';
import RecruiterTable from '../../components/RecruiterTable/RecruiterTable';
import { RecruiterType, Template } from '../../interface';
import Loader from '../../components/Loader/Loader';

const Home = (props: {
  templates: Template[];
  recruiters: RecruiterType[];
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  loading: boolean;
  fetchMore: () => void;
  lastRecruiterSeen: QueryDocumentSnapshot<DocumentData> | undefined;
  moreRecruitersLoading: boolean;
}) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-header-title" style={{ marginBottom: '1em' }}>
            Dashboard
          </h1>
        </div>
        <button
          className="submit-button home-submit-button"
          onClick={(e) => {
            setPopUpOpen(true);
          }}
        >
          Add Recruiter
        </button>
        {props.loading ? (
          <Loader />
        ) : (
          <>
            <RecruiterTable
              recruiters={props.recruiters}
              templates={props.templates}
              setRecruiters={props.setRecruiters}
              setPopUpOpen={setPopUpOpen}
            />
            {props.moreRecruitersLoading ? (
              <div className="loader" />
            ) : (
              <button
                className="load-more"
                onClick={() => props.fetchMore()}
                disabled={props.lastRecruiterSeen === undefined || props.recruiters.length % RECRUITERS_PER_PAGE !== 0}
              >
                Load More
              </button>
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
  );
};

export default Home;
