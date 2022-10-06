import './Home.css';

import Dialog from '@mui/material/Dialog';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import Form from '../../components/Form/Form';
import RecruiterTable from '../../components/RecruiterTable/RecruiterTable';
import { RecruiterType, Template } from '../../interface';

const Home = (props: {
  templates: Template[];
  recruiters: RecruiterType[];
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  loading: boolean;
}) => {
  const [message, setMessage] = useState<string>('');
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
          <div className="loader" />
        ) : (
          <>
            <RecruiterTable recruiters={props.recruiters} templates={props.templates} />
            {message}
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
        <Form
          setPopUpOpen={setPopUpOpen}
          setRecruiters={props.setRecruiters}
          setMessage={setMessage}
          cancel={() => setPopUpOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default Home;
