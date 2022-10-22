import './RecruiterTable.css';

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import { arrayRemove, arrayUnion, deleteDoc, doc, increment, updateDoc } from 'firebase/firestore';
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
  selectedTemplateID: string;
  setSelectedTemplateID: Dispatch<SetStateAction<string>>;
}) => {
  const { currentUser } = useAuth();
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType>(emptyRecruiter);

  const [copied, setCopied] = useState<boolean>(false);

  const deleteRecruiter = async (recruiterId: string) => {
    if (currentUser?.role === 'admin') {
      try {
        await deleteDoc(doc(db, 'recruiters', recruiterId));
        props.setRecruiters(props.recruiters.filter((recruiter) => recruiter.id !== recruiterId));
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { recruitersAdded: increment(-1) });
      } catch (e) {
        alert('There was an error, try again');
      }
    }
  };

  const copyTemplate = (recruiter: RecruiterType) => {
    const selectedTemplate = props.templates.find((template) => template.id === props.selectedTemplateID);
    if (selectedTemplate) {
      const replacedTemplate = selectedTemplate.template
        .replaceAll('{recruiter}', recruiter.firstName)
        .replaceAll('{company}', recruiter.company);
      navigator.clipboard.writeText(replacedTemplate).catch((e) => {
        alert('There was an error, try again');
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 750);
    }
  };

  const emailRecruiter = (recruiter: RecruiterType) => {
    const selectedTemplate = props.templates.find((template) => template.id === props.selectedTemplateID);
    if (selectedTemplate) {
      const emailBody = selectedTemplate.template
        .replaceAll('{recruiter}', recruiter.firstName)
        .replaceAll('{company}', recruiter.company)
        .replaceAll('\n', '%0d%0A');
      window.open('mailto:' + recruiter.email + '?subject=' + selectedTemplate.name + '&body=' + emailBody);
    }
  };

  const markSeen = async (recruiter: RecruiterType) => {
    if (currentUser?.emailVerified) {
      try {
        const recruiterRef = doc(db, 'recruiters', recruiter.id);
        await updateDoc(recruiterRef, {
          seenBy: arrayUnion(currentUser.uid),
        });
        props.setRecruiters((oldRecruiters) =>
          oldRecruiters.filter((recruiterI) => {
            if (recruiterI.id === recruiter.id) {
              const editedRecruiter = recruiterI;
              editedRecruiter.seenBy.push(currentUser.uid);
              return editedRecruiter;
            }
            return recruiterI;
          })
        );
      } catch (e) {
        alert('There was an error, try again');
      }
    }
  };

  const markUnseen = async (recruiter: RecruiterType) => {
    if (currentUser?.emailVerified) {
      try {
        const recruiterRef = doc(db, 'recruiters', recruiter.id);
        await updateDoc(recruiterRef, {
          seenBy: arrayRemove(currentUser?.uid),
        });
        props.setRecruiters((oldRecruiters) =>
          oldRecruiters.filter((recruiterI) => {
            if (recruiterI.id === recruiter.id) {
              const editedRecruiter = recruiterI;
              const index = editedRecruiter.seenBy.indexOf(currentUser.uid);
              if (index > -1) {
                editedRecruiter.seenBy.splice(index, 1);
              }
            }
            return recruiterI;
          })
        );
      } catch (e) {
        alert('There was an error, try again');
      }
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
            <button
              style={{
                color: currentUser && recruiter.seenBy.includes(currentUser.uid) ? 'black' : '#117cee',
              }}
              onClick={async () =>
                currentUser && recruiter.seenBy.includes(currentUser.uid)
                  ? await markUnseen(recruiter)
                  : await markSeen(recruiter)
              }
              className="list-row-status"
            >
              {currentUser && recruiter.seenBy.includes(currentUser.uid) ? 'Seen' : 'New!'}
            </button>
            <div className="list-row-content">
              <a className="list-row-title" onClick={() => openURL(recruiter.linkedIn)}>
                {recruiter.firstName} {recruiter.lastName}
              </a>
              <p className="list-row-subtitle">{recruiter.company}</p>
              <p className="list-row-body-text">{recruiter.title}</p>
            </div>
            <div className="list-row-button-group">
              <select
                className="list-row-button"
                name="template"
                onChange={(e) => props.setSelectedTemplateID(e.target.value)}
                value={props.selectedTemplateID}
              >
                <option value="No template">No Template</option>
                {props.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
                {props.templates.length === 0 && <option disabled>Create new templates in the templates tab!</option>}
              </select>
              <button
                className="list-row-button"
                disabled={props.selectedTemplateID === 'No template'}
                onClick={() => copyTemplate(recruiter)}
                title="Click to copy templated email to clipboard"
              >
                <CopyIcon disabled={props.selectedTemplateID === 'No template'} />
              </button>
              <button
                className="list-row-button"
                onClick={() =>
                  props.selectedTemplateID !== 'No template'
                    ? emailRecruiter(recruiter)
                    : window.open('mailto:' + recruiter.email)
                }
                title="Click to open new email draft"
              >
                <EmailIcon disabled={false} />
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
