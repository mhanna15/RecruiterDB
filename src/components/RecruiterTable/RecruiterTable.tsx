import './RecruiterTable.css';

import { DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React, { useState } from 'react';

import { RecruiterType } from '../../interface';

const RecruiterTable = (props: { recruiters: RecruiterType[] }) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>();

  return (
    <div className="list-root">
      <div className="list-container">
        {props.recruiters.map((recruiter) => (
          <div
            className="list-row"
            key={recruiter.name}
            onClick={(e) => {
              setSelectedRecruiter(recruiter);
              setPopUpOpen(true);
            }}
          >
            <p className="list-row-title">{recruiter.name}</p>
            <p className="list-row-subtitle">{recruiter.company}</p>
            <p className="list-row-body-text">{recruiter.title}</p>
          </div>
        ))}
      </div>
      <Dialog open={popUpOpen} onClose={() => setPopUpOpen(false)}>
        <DialogTitle>{selectedRecruiter?.name}</DialogTitle>
        <p>email: {selectedRecruiter?.email}</p>
        <p>company: {selectedRecruiter?.company}</p>
        <p>title: {selectedRecruiter?.title}</p>
        <p>linkedIn: {selectedRecruiter?.linkedIn}</p>
      </Dialog>
    </div>
  );
};

export default RecruiterTable;
