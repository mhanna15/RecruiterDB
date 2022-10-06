import './Home.css';

import Dialog from '@mui/material/Dialog';
import React, { Dispatch, SetStateAction, useState } from 'react';

import Form from '../../components/Form/Form';
import RecruiterTable from '../../components/RecruiterTable/RecruiterTable';
import { RecruiterType, Template } from '../../interface';

const Home = (props: {
  templates: Template[];
  recruiters: RecruiterType[];
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
}) => {
  const [message, setMessage] = useState<string>('');
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);

  return (
    <div className="page-root">
      <div className="page-content">
        <button
          className="submit-button home-submit-button"
          onClick={(e) => {
            setPopUpOpen(true);
          }}
        >
          Add Recruiter
        </button>
        <RecruiterTable recruiters={props.recruiters} templates={props.templates} />
        {message}
      </div>
      <Dialog fullWidth={true} style={{ width: '100%' }} open={popUpOpen} onClose={() => setPopUpOpen(false)}>
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
