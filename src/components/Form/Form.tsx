import { doc, setDoc } from 'firebase/firestore';

import { Autocomplete, OutlinedInput, Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { db } from '../../firebase';
import { Company, RecruiterType } from '../../interface';
import './Form.css';

interface FormProps {
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const Form = (props: FormProps) => {
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');

  const [companies, setCompanies] = useState<Company[]>([]);

  const [inputValue, setInputValue] = useState<string>('');

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
    }).then(() => props.setMessage('success!'));
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
    props.setRecruiters((oldArray) => [
      ...oldArray,
      {
        name,
        email,
        company,
        title,
        linkedIn,
      },
    ]);
    await addRecruiter().then(() => props.setPopUpOpen(false));
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Add New Recruiter</p>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Recruiter Name"
        required
        value={name}
      />
      <input
        onChange={(e) => {
          setCompany(e.target.value);
        }}
        placeholder="Company"
        required
        value={company}
      />
      {/* <Autocomplete
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
        renderInput={(params) => <Input {...params} label="Company" />}
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
      /> */}
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
      <button className="button-submit" type="submit">
        Add
      </button>
    </form>
  );
};

export default Form;
