import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { db } from '../firebase';

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

interface Recruiter {
  name: string;
  email: string;
  company: string;
  title: string;
  linkedIn: string;
}

const LoggedInHome = () => {
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  const clearForm = () => {
    setName('');
    setCompany('');
    setEmail('');
    setTitle('');
    setLinkedIn('');
  };

  const addRecruiter = async () => {
    // TODO: sanitize name or id input
    await setDoc(doc(db, 'recruiters', name), {
      name,
      company,
      email,
      title,
      linkedIn,
    }).then(() => setMessage('success!'));
    clearForm();
  };

  useEffect(() => {
    const getRecruiters = async () => {
      // const q = query(collection(db, 'recruiters'));
      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   const recruiter = doc.data();
      //   setRecruiters((oldArray) => [
      //     ...oldArray,
      //     {
      //       name: recruiter.name,
      //       email: recruiter.email,
      //       company: recruiter.company,
      //       title: recruiter.title,
      //       linkedIn: recruiter.linkedIn,
      //     },
      //   ]);
      // });
      setTimeout(() => {
        setRecruiters(mockRecruiters);
      }, 200);
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
  };

  console.log(recruiters);

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
        <input
          onChange={(e) => {
            setCompany(e.target.value);
          }}
          placeholder="company"
          required
          value={company}
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
      {recruiters.map((recruiter) => (
        <div key={recruiter.name}>
          <p>name: {recruiter.name}</p>
          <p>company: {recruiter.company}</p>
          <p>email: {recruiter.email}</p>
          <p>title: {recruiter.title}</p>
          <p>linkedIn: {recruiter.linkedIn}</p>
        </div>
      ))}
      {message}
    </div>
  );
};

export default LoggedInHome;
