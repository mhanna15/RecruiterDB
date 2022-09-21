import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { db } from '../../firebase';

const Companies = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [companiesAndRecruiters, setCompaniesAndRecruiters] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    const getCompanies = async () => {
      console.log('fetching companies from firebase')
      const q = query(collection(db, 'companies'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const companyName = doc.id;
        const data = doc.data();
        setCompanies((oldArray) => [...oldArray, companyName]);
        setCompaniesAndRecruiters((oldArray) => ({
          ...oldArray,
          [companyName]: data.recruiters,
        }));
      });
      // setTimeout(() => {
      //   setcompanies(mockcompanies);
      // }, 200);
    };
    getCompanies().catch((e) => setMessage(JSON.stringify(e)));
  }, []);

  return (
    <div>
      <h1>companies page</h1>
      <Autocomplete
        disablePortal
        options={companies}
        inputValue={inputValue}
        onChange={(e, value) => {
          if (value !== null) {
            setSelectedCompany(value);
          }
        }}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Company" />}
        // need to fix page rerendering
        onInputChange={(_e, newValue) => {
          setInputValue(newValue);
        }}
      />
      {selectedCompany !== '' ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companiesAndRecruiters[selectedCompany].map((recruiter) => (
                <TableRow
                  key={recruiter}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  hover
                >
                  <TableCell component="th" scope="row">
                    {recruiter}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}

      {message}
    </div>
  );
};

export default Companies;
