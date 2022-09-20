import { DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';

import { RecruiterType } from './LoggedInHome';

const Recruiter = (props: { recruiters: RecruiterType[] }) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Company</TableCell>
            <TableCell align="right">Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.recruiters.map((recruiter) => (
            <TableRow
              key={recruiter.name}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
              hover
              onClick={(e) => {
                setSelectedRecruiter(recruiter);
                setPopUpOpen(true);
              }}
            >
              <TableCell component="th" scope="row">
                {recruiter.name}
              </TableCell>
              <TableCell align="left">{recruiter.company}</TableCell>
              <TableCell align="right">{recruiter.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={popUpOpen} onClose={() => setPopUpOpen(false)}>
        <DialogTitle>{selectedRecruiter?.name}</DialogTitle>
        <p>email: {selectedRecruiter?.email}</p>
        <p>company: {selectedRecruiter?.company}</p>
        <p>title: {selectedRecruiter?.title}</p>
        <p>linkedIn: {selectedRecruiter?.linkedIn}</p>
      </Dialog>
    </TableContainer>
  );
};

export default Recruiter;
