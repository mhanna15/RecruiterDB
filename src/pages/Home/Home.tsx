import './Home.css';

import Dialog from '@mui/material/Dialog';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { RECRUITERS_PER_PAGE } from '../../App';
import { useAuth } from '../../auth/AuthContext';
import Form from '../../components/Form/Form';
import Loader from '../../components/Loader/Loader';
import RecruiterTable from '../../components/RecruiterTable/RecruiterTable';
import { RecruiterType, Template } from '../../interface';
import Landing from '../Landing/Landing';

const Home = (props: {
  templates: Template[];
  recruiters: RecruiterType[];
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  loading: boolean;
  fetchMore: () => void;
  lastRecruiterSeen: QueryDocumentSnapshot<DocumentData> | undefined;
  lastRecruiter: DocumentData | undefined;

  moreRecruitersLoading: boolean;
}) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const { currentUser } = useAuth();

  return currentUser?.emailVerified ? (
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
              <>
                {props.recruiters.find((recruiter) => recruiter.id === props.lastRecruiter?.id) === undefined ? (
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
