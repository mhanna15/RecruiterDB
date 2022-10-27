import { getAnalytics, logEvent } from 'firebase/analytics';
import { arrayRemove, arrayUnion, deleteDoc, doc, increment, updateDoc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction } from 'react';

import DeleteIcon from '../assets/DeleteIcon/DeleteIcon';
import EditIcon from '../assets/EditIcon/EditIcon';
import EmailIcon from '../assets/EmailIcon/EmailIcon';
import LinkedInIcon from '../assets/LinkedInIcon/LinkedInIcon';
import { useAuth } from '../auth/AuthContext';
import { db } from '../firebase';
import { RecruiterType, Template } from '../interface';

const Recruiter = (props: {
  templates: Template[];
  recruiter: RecruiterType;
  recruiters: RecruiterType[];
  selectedTemplateID: string;
  setCopied: Dispatch<SetStateAction<boolean>>;
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedTemplateID: Dispatch<SetStateAction<string>>;
  setRecruiters: Dispatch<SetStateAction<RecruiterType[]>>;
  setSelectedRecruiter: Dispatch<SetStateAction<RecruiterType>>;
}) => {
  const { currentUser } = useAuth();
  const analytics = getAnalytics();

  const openURL = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
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

  return (
    <tr>
      <td>
        <input
          className="input-checkbox"
          type="checkbox"
          defaultChecked={!(currentUser && props.recruiter.seenBy.includes(currentUser.uid))}
          onClick={async () =>
            currentUser && props.recruiter.seenBy.includes(currentUser.uid)
              ? await markUnseen(props.recruiter)
              : await markSeen(props.recruiter)
          }
        />
      </td>
      <td>
        {props.recruiter.firstName} {props.recruiter.lastName}
      </td>
      <td>{props.recruiter.company}</td>
      <td>{props.recruiter.title}</td>
      <td>
        <div className="list-row-buttons">
          <select
            className="list-row-button"
            name="template"
            onChange={(e) => props.setSelectedTemplateID(e.target.value)}
            value={props.selectedTemplateID}
          >
            <option value="No template">No Email Template</option>
            {props.templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
            {props.templates.length === 0 && <option disabled>Create new templates in the templates tab!</option>}
          </select>
          <button
            className="list-row-button list-row-button-right"
            onClick={() => {
              logEvent(analytics, 'email_button_clicked', {
                with_template: props.selectedTemplateID !== 'No template',
              });
              props.selectedTemplateID !== 'No template'
                ? emailRecruiter(props.recruiter)
                : window.open('mailto:' + props.recruiter.email);
            }}
            title="Click to open new email draft"
          >
            <EmailIcon disabled={false} />
          </button>
        </div>
      </td>
      <td>
        <button className="list-row-button" onClick={() => openURL(props.recruiter.linkedIn)}>
          <LinkedInIcon disabled={false} />
        </button>
      </td>
      {currentUser?.role === 'admin' ? (
        <>
          <td>
            <div className="list-row-buttons">
              <button
                className="list-row-button"
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    props.setSelectedRecruiter(props.recruiter);
                    props.setPopUpOpen(true);
                  }
                }}
              >
                <EditIcon disabled={false} />
              </button>
              <button
                className="list-row-button list-row-button-right"
                onClick={async () => await deleteRecruiter(props.recruiter.id)}
              >
                <DeleteIcon disabled={false} />
              </button>
            </div>
          </td>
        </>
      ) : (
        <></>
      )}
    </tr>
  );
};

export default Recruiter;
