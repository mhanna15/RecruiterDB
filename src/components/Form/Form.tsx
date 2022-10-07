import './Form.css';

import { collection, doc, setDoc } from 'firebase/firestore';
import _ from 'lodash';
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase';
import { Company, emptyRecruiter, RecruiterType } from '../../interface';

interface FormProps {
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  existingRecruiter?: RecruiterType;
}

const Form = (props: FormProps) => {
  const { currentUser } = useAuth();
  const [recruiterData, setRecruiterData] = useState<RecruiterType>(
    props.existingRecruiter ? props.existingRecruiter : emptyRecruiter
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecruiterData((prevRecruiterData) => {
      return {
        ...prevRecruiterData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const clearForm = () => {
    setRecruiterData(emptyRecruiter);
  };

  const handleAddNewRecruiter = async (e: any) => {
    e.preventDefault();
    const newRecruiterRef = doc(collection(db, 'recruiters'));
    await setDoc(newRecruiterRef, { ...recruiterData, id: newRecruiterRef.id });
    props.setRecruiters((oldArray) => [...oldArray, { ...recruiterData, id: newRecruiterRef.id }]);
    props.setPopUpOpen(false);
    clearForm();
  };

  const handleEditRecruiter = async (e: any) => {
    e.preventDefault();
    if (props.existingRecruiter && currentUser?.role === 'admin') {
      await setDoc(doc(db, 'recruiters', props.existingRecruiter.id), recruiterData);
      props.setRecruiters((oldArray) =>
        oldArray.map((recruiter) => {
          if (recruiter.id === props.existingRecruiter?.id) {
            return recruiterData;
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
          name="firstName"
          onChange={handleChange}
          placeholder="Recruiter First Name"
          required
          value={recruiterData.firstName}
        />
        <input
          className="form-row-col"
          name="lastName"
          onChange={handleChange}
          placeholder="Recruiter Last Name"
          required
          value={recruiterData.lastName}
        />
      </div>
      <input name="email" onChange={handleChange} placeholder="Email" required value={recruiterData.email} />
      <input name="company" onChange={handleChange} placeholder="Company" required value={recruiterData.company} />
      <input name="title" onChange={handleChange} placeholder="Job Title" required value={recruiterData.title} />
      <input
        name="linkedIn"
        onChange={handleChange}
        placeholder="LinkedIn Profile"
        required
        value={recruiterData.linkedIn}
      />
      <button
        className="submit-button"
        type="submit"
        disabled={
          recruiterData.firstName === '' ||
          recruiterData.lastName === '' ||
          recruiterData.email === '' ||
          recruiterData.company === '' ||
          recruiterData.title === '' ||
          recruiterData.linkedIn === '' ||
          _.isEqual(props.existingRecruiter, recruiterData)
        }
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
