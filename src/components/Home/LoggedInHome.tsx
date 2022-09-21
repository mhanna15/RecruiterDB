import { Autocomplete, TextField } from '@mui/material';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';

import { db } from '../../firebase';
import RecruiterTable from '../Recruiter/Recruiter';

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

export interface RecruiterType {
  name: string;
  email: string;
  company: string;
  title: string;
  linkedIn: string;
}

export interface Company {
  name: string;
  domain: string;
  logo: string;
}

const LoggedInHome = () => {
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  console.log(inputValue);

  const clearForm = () => {
    setName('');
    setCompany('');
    setEmail('');
    setTitle('');
    setLinkedIn('');
    setInputValue('');
  };

  const addRecruiter = async () => {
    // TODO: sanitize name or id input
    await setDoc(doc(db, 'recruiters', name), {
      name,
      company,
      email,
      title,
      linkedIn,
    })
      .then(async () => {
        const companyRef = doc(db, 'companies', company);
        const companySnap = await getDoc(companyRef);
        if (companySnap.exists()) {
          await updateDoc(companyRef, { recruiters: arrayUnion(name) });
        } else {
          await setDoc(companyRef, { recruiters: [name] });
        }
      })
      .then(() => setMessage('success!'))
      .catch((e) => setMessage(JSON.stringify(e)));
  };

  const fetchCompanyOptions = (input: string) => {
    console.log('companies fetched');
    if (input !== '') {
      fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=:${input}`
      )
        .then(async (response) => await response.json())
        .then((data) => setCompanies([...data]))
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    const getRecruiters = async () => {
      const q = query(collection(db, 'recruiters'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const recruiter = doc.data();
        setRecruiters((oldArray) => [
          ...oldArray,
          {
            name: recruiter.name,
            email: recruiter.email,
            company: recruiter.company,
            title: recruiter.title,
            linkedIn: recruiter.linkedIn,
          },
        ]);
      });
      // setTimeout(() => {
      //   setRecruiters(mockRecruiters);
      //   console.log('recruiters fetched');
      // }, 200);
    };
    getRecruiters().catch((e) => setMessage(JSON.stringify(e)));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setRecruiters((oldArray) => [
      ...oldArray,
      {
        name,
        email,
        company,
        title,
        linkedIn,
      },
    ]);
    await addRecruiter();
    clearForm();
  };

  console.log('page rerendered');

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="name"
          required
          value={name}
        />
        <Autocomplete
          disablePortal
          options={companies}
          inputValue={inputValue}
          onChange={(e, value) => {
            if (value !== null) {
              setCompany(value.name);
            }
          }}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Company" />}
          renderOption={(props, option) => (
            <li {...props}>
              <p>
                {option.name}:{' '}
                <img src={option.logo} height="20px" width="20px" />
              </p>
            </li>
          )}
          // need to fix page rerendering
          onInputChange={(_e, newValue) => {
            setInputValue(newValue);
            fetchCompanyOptions(newValue);
          }}
        />
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="email"
          required
          value={email}
        />
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="title"
          required
          value={title}
        />
        <input
          onChange={(e) => {
            setLinkedIn(e.target.value);
          }}
          placeholder="LinkedIn profile"
          required
          value={linkedIn}
        />
        <button>Add recruiter!</button>
      </form>
      {/* {recruiters.map((recruiter) => (
        <div key={recruiter.name}>
          <Recruiter recruiter={recruiter} />
        </div>
      ))} */}
      <RecruiterTable recruiters={recruiters} />
      {message}
    </div>
  );
};

export default LoggedInHome;
