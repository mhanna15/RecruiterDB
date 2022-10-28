import './RecruiterTable.css';

import { Hit } from '@algolia/client-search';
import Dialog from '@mui/material/Dialog';
import { SearchIndex } from 'algoliasearch';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { RecruiterType, Template } from '../../interface';
import Form from '../Form/Form';
import Recruiter from '../Recruiter';

const RecruiterTable = (props: {
  index: SearchIndex;
  templates: Template[];
  selectedTemplateID: string;
  setSelectedTemplateID: Dispatch<SetStateAction<string>>;
  recruiters: Array<Hit<RecruiterType>>;
  setRecruiters: Dispatch<SetStateAction<Array<Hit<RecruiterType>>>>;
}) => {
  const { currentUser } = useAuth();
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Hit<RecruiterType>>({} as Hit<RecruiterType>);

  return (
    <div className="list-root">
      <div className="list-container">
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
                  index={props.index}
                  recruiter={recruiter}
                  setRecruiters={props.setRecruiters}
                  setSelectedRecruiter={setSelectedRecruiter}
                  templates={props.templates}
                  selectedTemplateID={props.selectedTemplateID}
                  setSelectedTemplateID={props.setSelectedTemplateID}
                  setPopUpOpen={setPopUpOpen}
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
