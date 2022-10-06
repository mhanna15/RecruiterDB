import './Home.css';

import Dialog from '@mui/material/Dialog';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import Form from '../../components/Form/Form';
import RecruiterTable from '../../components/RecruiterTable/RecruiterTable';
import { db } from '../../firebase';
import { RecruiterType, Template } from '../../interface';

const mockRecruiters = [
  {
    name: 'warren lee',
    email: 'wlee1@gmail.com',
    company: 'service now',
    title: 'recruiter',
    linkedIn: 'wlee',
  },
  {
    name: 'testing',
    email: 'hi',
    company: 'test',
    title: 'hey',
    linkedIn: 'you',
  },
  {
    name: 'hi1',
    email: 'hy',
    company: 'hi',
    title: 'sourcer',
    linkedIn: 'y',
  },
  {
    name: 'Mina Hanna',
    email: 'minaghanna@gmail.com',
    company: 'Atlassian',
    title: 'campus recruiter',
    linkedIn: 'minaghanna',
  },
  {
    name: 'Kayla Bowers',
    email: 'kbowers@atlassian.com',
    company: 'Atlassian',
    title: 'recruiter',
    linkedIn: 'linkedin.com/kaylabowers',
  },
];

const LoggedInHome = (props: { templates: Template[] }) => {
  const [message, setMessage] = useState<string>('');
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);

  useEffect(() => {
    const getRecruiters = async () => {
      console.log('fetching recruiters from firebase');
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
    };
    getRecruiters().catch((e) => setMessage(JSON.stringify(e)));
    // setTimeout(() => {
    //   setRecruiters(mockRecruiters);
    // }, 200);
  }, []);

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-header-title" style={{ marginBottom: '1em' }}>
            Dashboard
          </h1>
        </div>
        <button
          className="submit-button "
          onClick={(e) => {
            setPopUpOpen(true);
          }}
        >
          Add Recruiter
        </button>
        {recruiters.length === 0 ? (
          <div className="loader" />
        ) : (
          <>
            <RecruiterTable recruiters={recruiters} templates={props.templates} />
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
          setRecruiters={setRecruiters}
          setMessage={setMessage}
          cancel={() => setPopUpOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default LoggedInHome;
