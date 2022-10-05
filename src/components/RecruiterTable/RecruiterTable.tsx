import './RecruiterTable.css';

import Dialog from '@mui/material/Dialog';
import React, { useState } from 'react';

import { emptyRecruiter, RecruiterType, Template } from '../../interface';
import ListCard from '../ListCard/ListCard';

const RecruiterTable = (props: { recruiters: RecruiterType[]; templates: Template[] }) => {
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>(emptyRecruiter);
  const [selectedTemplateID, setSelectedTemplateID] = useState<string>();

  const copyTemplate = (recruiter: RecruiterType) => {
    const selectedTemplate = props.templates.find((template) => template.id === selectedTemplateID);
    if (selectedTemplate) {
      let temp = selectedTemplate.template.replace('{recruiter}', recruiter.firstName);
      temp = temp.replace('{company}', recruiter.company);
      navigator.clipboard.writeText(temp).catch(console.log);
    }
  };

  return (
    <div className="list-root">
      <div className="list-container">
        {props.recruiters.map((recruiter) => (
          <div className="list-row" key={recruiter.id}>
            <div
              className="list-row-content"
              onClick={() => {
                setSelectedRecruiter(recruiter);
                setPopUpOpen(true);
              }}
            >
              <p className="list-row-title">
                {recruiter.firstName} {recruiter.lastName}
              </p>
              <p className="list-row-subtitle">{recruiter.company}</p>
              <p className="list-row-body-text">{recruiter.title}</p>
            </div>
            <div className="list-row-button-group">
              <select
                className="list-row-button"
                name="template"
                onChange={(e) => setSelectedTemplateID(e.target.value)}
                value={selectedTemplateID}
              >
                <option disabled selected>
                  Pick Template
                </option>
                {props.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button className="list-row-button" onClick={() => copyTemplate(recruiter)}>
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={popUpOpen} onClose={() => setPopUpOpen(false)}>
        <ListCard recruiter={selectedRecruiter} />
      </Dialog>
    </div>
  );
};

export default RecruiterTable;
