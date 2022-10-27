import './RecruiterTable.css';

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { emptyRecruiter, RecruiterType, Template } from '../../interface';
import Form from '../Form/Form';
import Recruiter from '../Recruiter';

const RecruiterTable = (props: {
  templates: Template[];
  selectedTemplateID: string;
  recruiters: RecruiterType[];
  setSelectedTemplateID: Dispatch<SetStateAction<string>>;
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
}) => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>(emptyRecruiter);

  return (
    <div className="list-root">
      <div className="list-container">
        <Collapse className="list-row-alert" in={copied}>
          <Alert severity="success">Copied</Alert>
        </Collapse>
        <table className="rounded-lg">
          <tbody>
            <tr>
              <th style={{ display: 'flex', justifyContent: 'center' }}>New</th>
              <th>Name</th>
              <th>Company</th>
              <th>Title</th>
              <th>Email</th>
              <th>LinkedIn</th>
              {currentUser?.role === 'admin' ? <th>Admin</th> : <></>}
            </tr>
            {props.recruiters.map((recruiter) => {
              return (
                <Recruiter
                  key={recruiter.id}
                  recruiter={recruiter}
                  setCopied={setCopied}
                  templates={props.templates}
                  setPopUpOpen={setPopUpOpen}
                  recruiters={props.recruiters}
                  setRecruiters={props.setRecruiters}
                  setSelectedRecruiter={setSelectedRecruiter}
                  selectedTemplateID={props.selectedTemplateID}
                  setSelectedTemplateID={props.setSelectedTemplateID}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog fullWidth open={popUpOpen} onClose={() => setPopUpOpen(false)}>
        <Form setPopUpOpen={setPopUpOpen} setRecruiters={props.setRecruiters} existingRecruiter={selectedRecruiter} />
      </Dialog>
    </div>
  );
};

export default RecruiterTable;
