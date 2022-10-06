import './Form.css';

import { collection, doc, setDoc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { db } from '../../firebase';
import { Company, RecruiterType } from '../../interface';

interface FormProps {
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  setMessage: Dispatch<SetStateAction<string>>;
  cancel: Dispatch<SetStateAction<boolean>>;
}

const Form = (props: FormProps) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const [company, setCompany] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');

  const [companies, setCompanies] = useState<Company[]>([]);

  const [inputValue, setInputValue] = useState<string>('');

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setCompany('');
    setEmail('');
    setTitle('');
    setLinkedIn('');
  };
  const addRecruiter = async () => {
    // TODO: sanitize name or id input
  };
  const fetchCompanyOptions = (input: string) => {
    console.log('companies fetched');
    if (input !== '') {
      fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=:${input}`)
        .then(async (response) => await response.json())
        .then((data) => setCompanies([...data]))
        .catch((e) => console.log(e));
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newRecruiterRef = doc(collection(db, 'recruiters'));
    props.setRecruiters((oldArray) => [
      ...oldArray,
      {
        id: newRecruiterRef.id,
        firstName,
        lastName,
        email,
        company,
        title,
        linkedIn,
      },
    ]);
    await setDoc(newRecruiterRef, {
      id: newRecruiterRef.id,
      firstName,
      lastName,
      company,
      email,
      title,
      linkedIn,
    }).then(() => {
      props.setMessage('success!');
      props.setPopUpOpen(false);
    });
    clearForm();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="form-title">Add Recruiter</p>
      <div className="form-row">
        <input
          className="form-row-col form-row-col-left"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          placeholder="Recruiter First Name"
          required
          value={firstName}
        />
        <input
          className="form-row-col"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          placeholder="Recruiter Last Name"
          required
          value={lastName}
        />
      </div>
      <input
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Email"
        required
        value={email}
      />
      <input
        onChange={(e) => {
          setCompany(e.target.value);
        }}
        placeholder="Company"
        required
        value={company}
      />

      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        placeholder="Job Title"
        required
        value={title}
      />
      <input
        onChange={(e) => {
          setLinkedIn(e.target.value);
        }}
        placeholder="LinkedIn Profile"
        required
        value={linkedIn}
      />
      <button
        className="submit-button"
        type="submit"
        disabled={
          firstName === '' || lastName === '' || email === '' || company === '' || title === '' || linkedIn === ''
        }
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
