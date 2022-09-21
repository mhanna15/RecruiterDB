import React, { useCallback, useEffect, useState } from 'react';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

import { Company, RecruiterType } from '../../interface';

const Form = () => {
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);

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
};
