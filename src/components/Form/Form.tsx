import './Form.css';

import { collection, doc, setDoc } from 'firebase/firestore';
import _ from 'lodash';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase';
import { Company, RecruiterType } from '../../interface';

interface FormProps {
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  existingRecruiter?: RecruiterType;
}

const Form = (props: FormProps) => {
  const { currentUser } = useAuth();
  const [id, setID] = useState<string>(props.existingRecruiter ? props.existingRecruiter.id : '');
  const [firstName, setFirstName] = useState<string>(props.existingRecruiter ? props.existingRecruiter.firstName : '');
  const [lastName, setLastName] = useState<string>(props.existingRecruiter ? props.existingRecruiter.lastName : '');
  const [company, setCompany] = useState<string>(props.existingRecruiter ? props.existingRecruiter.company : '');
  const [email, setEmail] = useState<string>(props.existingRecruiter ? props.existingRecruiter.email : '');
  const [title, setTitle] = useState<string>(props.existingRecruiter ? props.existingRecruiter.title : '');
  const [linkedIn, setLinkedIn] = useState<string>(props.existingRecruiter ? props.existingRecruiter.linkedIn : '');

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

  const fetchCompanyOptions = (input: string) => {
    console.log('companies fetched');
    if (input !== '') {
      fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=:${input}`)
        .then(async (response) => await response.json())
        .then((data) => setCompanies([...data]))
        .catch((e) => console.log(e));
    }
  };

  const handleAddNewRecruiter = async (e: any) => {
    e.preventDefault();
    const newRecruiterRef = doc(collection(db, 'recruiters'));
    setID(newRecruiterRef.id);
    await setDoc(newRecruiterRef, {
      id,
      firstName,
      lastName,
      company,
      email,
      title,
      linkedIn,
    });
    props.setRecruiters((oldArray) => [
      ...oldArray,
      {
        id,
        firstName,
        lastName,
        email,
        company,
        title,
        linkedIn,
      },
    ]);
    props.setPopUpOpen(false);
    clearForm();
  };

  const handleEditRecruiter = async (e: any) => {
    e.preventDefault();
    if (props.existingRecruiter && currentUser?.role === 'admin') {
      await setDoc(doc(db, 'recruiters', props.existingRecruiter.id), {
        id,
        firstName,
        lastName,
        company,
        email,
        title,
        linkedIn,
      });
      props.setRecruiters((oldArray) =>
        oldArray.map((recruiter) => {
          if (recruiter.id === props.existingRecruiter?.id) {
            return { id, firstName, lastName, company, email, title, linkedIn };
          }
          return recruiter;
        })
      );
      props.setPopUpOpen(false);
      clearForm();
    }
  };

  return (
    <form className="form" onSubmit={props.existingRecruiter ? handleEditRecruiter : handleAddNewRecruiter}>
      <p className="form-title">{props.existingRecruiter ? 'Edit Recruiter' : 'Add Recruiter'}</p>
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
          firstName === '' ||
          lastName === '' ||
          email === '' ||
          company === '' ||
          title === '' ||
          linkedIn === '' ||
          _.isEqual(props.existingRecruiter, {
            id,
            firstName,
            lastName,
            email,
            company,
            title,
            linkedIn,
          })
        }
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
