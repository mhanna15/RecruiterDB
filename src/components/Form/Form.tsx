import './Form.css';

import { collection, doc, increment, setDoc, updateDoc } from 'firebase/firestore';
import _ from 'lodash';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase';
import { emptyRecruiter, RecruiterType } from '../../interface';

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
  const [errors, setErrors] = useState({ email: true, linkedIn: true });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const emailIsValid = () => {
    return (
      String(recruiterData.email)
        .toLowerCase()
        .match(
          // eslint-disable-next-line no-control-regex
          /(?:[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm
        ) === null
    );
  };

  const linkedInIsValid = () => {
    return (
      String(recruiterData.linkedIn)
        .toLowerCase()
        .match(/(?:https?:)?\/\/(?:[\w]+\.)?linkedin\.com\/in\/([\w\-\\_À-ÿ%]+)\/?/gm) === null
    );
  };

  useEffect(() => {
    setErrors({ email: emailIsValid(), linkedIn: linkedInIsValid() });
  }, [recruiterData]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecruiterData((prevRecruiterData) => {
      if (
        event.target.name === 'firstName' ||
        event.target.name === 'lastName' ||
        event.target.name === 'company' ||
        event.target.name === 'title'
      ) {
        return {
          ...prevRecruiterData,
          [event.target.name]: event.target.value
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' '),
        };
      }
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
    setButtonDisabled(true);
    try {
      e.preventDefault();
      if (_.isEqual(errors, { email: false, linkedIn: false }) && currentUser) {
        const newRecruiterRef = doc(collection(db, 'recruiters'));
        const time = new Date().getTime();
        await setDoc(newRecruiterRef, {
          ...recruiterData,
          id: newRecruiterRef.id,
          dateAddedMillis: time,
          seenBy: [],
          addedBy: currentUser.uid,
        });
        props.setRecruiters((oldArray) => [
          { ...recruiterData, id: newRecruiterRef.id, dateAddedMillis: time, seenBy: [], addedBy: currentUser.uid },
          ...oldArray,
        ]);
        props.setPopUpOpen(false);
        clearForm();
        const userRef = doc(db, 'users', currentUser?.uid);
        await updateDoc(userRef, { recruitersAdded: increment(1) });
      } else {
        for (const [key, value] of Object.entries(errors)) {
          if (value) {
            alert(`${key} is invalid`);
          }
        }
      }
    } catch (error: any) {
      alert('There was an error, try again');
    }
    setButtonDisabled(false);
  };

  const handleEditRecruiter = async (e: any) => {
    e.preventDefault();
    setButtonDisabled(true);
    if (_.isEqual(errors, { email: false, linkedIn: false })) {
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
    } else {
      for (const [key, value] of Object.entries(errors)) {
        if (value) {
          alert(`${key} is invalid`);
        }
      }
    }
    setButtonDisabled(false);
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
          pattern="[A-Za-z]+"
          title="First Name Only"
        />
        <input
          className="form-row-col"
          name="lastName"
          onChange={handleChange}
          placeholder="Recruiter Last Name"
          required
          value={recruiterData.lastName}
          pattern="[A-Za-z]+"
          title="Last Name Only"
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
          _.isEqual(props.existingRecruiter, recruiterData) ||
          buttonDisabled
        }
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
