import './RecruiterTable.css';

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import CopyIcon from '../../assets/CopyIcon/CopyIcon';
import DeleteIcon from '../../assets/DeleteIcon/DeleteIcon';
import EditIcon from '../../assets/EditIcon/EditIcon';
import EmailIcon from '../../assets/EmailIcon/EmailIcon';
import LinkedInIcon from '../../assets/LinkedInIcon/LinkedInIcon';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase';
import { emptyRecruiter, RecruiterType, Template } from '../../interface';
import Form from '../Form/Form';

const RecruiterTable = (props: {
  recruiters: RecruiterType[];
  templates: Template[];
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { currentUser } = useAuth();
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>(emptyRecruiter);
  const [selectedTemplateID, setSelectedTemplateID] = useState<string>();
  const [copied, setCopied] = useState<boolean>(false);

  const deleteRecruiter = async (recruiterId: string) => {
    if (currentUser?.role === 'admin') {
      try {
        await deleteDoc(doc(db, 'recruiters', recruiterId));
        props.setRecruiters(props.recruiters.filter((recruiter) => recruiter.id !== recruiterId));
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }
  };

  const copyTemplate = (recruiter: RecruiterType) => {
    const selectedTemplate = props.templates.find((template) => template.id === selectedTemplateID);
    if (selectedTemplate) {
      const replacedTemplate = selectedTemplate.template
        .replaceAll('{recruiter}', recruiter.firstName)
        .replaceAll('{company}', recruiter.company);
      navigator.clipboard.writeText(replacedTemplate).catch((e) => console.log(e));
      setCopied(true);
      setTimeout(() => setCopied(false), 750);
    }
  };

  const emailRecruiter = (recruiter: RecruiterType) => {
    const selectedTemplate = props.templates.find((template) => template.id === selectedTemplateID);
    if (selectedTemplate) {
      const emailBody = selectedTemplate.template
        .replaceAll('{recruiter}', recruiter.firstName)
        .replaceAll('{company}', recruiter.company)
        .replaceAll('\n', '%0d%0A');
      document.location = 'mailto:' + recruiter.email + '?subject=' + selectedTemplate.name + '&body=' + emailBody;
    }
  };

  const openURL = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="list-root">
      <div className="list-container">
        <Collapse className="list-row-alert" in={copied}>
          <Alert severity="success">Copied</Alert>
        </Collapse>
        {props.recruiters.map((recruiter) => (
          <div className="list-row" key={recruiter.id}>
            <div className="list-row-content">
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
                defaultValue={'DEFAULT'}
              >
                <option disabled value="DEFAULT">
                  Pick Template
                </option>
                {props.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                className="list-row-button"
                disabled={selectedTemplateID === undefined}
                onClick={() => copyTemplate(recruiter)}
              >
                <CopyIcon disabled={selectedTemplateID === undefined} />
              </button>
              <button
                className="list-row-button"
                disabled={selectedTemplateID === undefined}
                onClick={() => emailRecruiter(recruiter)}
              >
                <EmailIcon disabled={selectedTemplateID === undefined} />
              </button>
              <button className="list-row-button" onClick={() => openURL(recruiter.linkedIn)}>
                <LinkedInIcon disabled={false} />
              </button>
              {currentUser?.role === 'admin' ? (
                <>
                  <button
                    className="list-row-button"
                    onClick={() => {
                      if (currentUser?.role === 'admin') {
                        setSelectedRecruiter(recruiter);
                        setPopUpOpen(true);
                      }
                    }}
                  >
                    <EditIcon disabled={false} />
                  </button>
                  <button className="list-row-button" onClick={async () => await deleteRecruiter(recruiter.id)}>
                    <DeleteIcon disabled={false} />
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      </div>
      <Dialog fullWidth open={popUpOpen} onClose={() => setPopUpOpen(false)}>
        <Form setPopUpOpen={setPopUpOpen} setRecruiters={props.setRecruiters} existingRecruiter={selectedRecruiter} />
      </Dialog>
    </div>
  );
};

export default RecruiterTable;
