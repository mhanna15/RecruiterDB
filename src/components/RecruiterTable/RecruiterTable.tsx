import './RecruiterTable.css';

import { DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React, { useState } from 'react';
import ListCard from '../ListCard/ListCard';

import { RecruiterType } from '../../interface';

const RecruiterTable = (props: { recruiters: RecruiterType[] }) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>();

  return (
    <div className="list-root">
      <div className="list-container">
        {props.recruiters.map((recruiter) => (
          <div className="list-row" key={recruiter.name}>
            <div
              className="list-row-content"
              onClick={(e) => {
                setSelectedRecruiter(recruiter);
                setPopUpOpen(true);
              }}
            >
              <p className="list-row-title">{recruiter.name}</p>
              <p className="list-row-subtitle">{recruiter.company}</p>
              <p className="list-row-body-text">{recruiter.title}</p>
            </div>
            <div className="list-row-button-group">
              <button>Email</button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={popUpOpen} onClose={() => setPopUpOpen(false)}>
        <ListCard
          name={selectedRecruiter?.name}
          email={selectedRecruiter?.email}
          company={selectedRecruiter?.company}
          title={selectedRecruiter?.title}
          linkedIn={selectedRecruiter?.linkedIn}
        />
      </Dialog>
    </div>
  );
};

export default RecruiterTable;
