import { Autocomplete, TextField } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { db } from '../../firebase';
import { Company, RecruiterType } from '../../interface';

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
  );
};

export default Form;
