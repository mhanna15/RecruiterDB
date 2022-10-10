import './Templates.css';

import Dialog from '@mui/material/Dialog';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import TemplateInput from '../../components/TemplateInput/TemplateInput';
import { db } from '../../firebase';
import { Template } from '../../interface';
import Loader from '../../components/Loader/Loader';

const Templates = (props: {
  userTemplates: Template[];
  setUserTemplates: Dispatch<SetStateAction<Template[]>>;
  loading: boolean;
}) => {
  const [newTemplatePopUpOpen, setNewTemplatePopUpOpen] = useState<boolean>(false);
  const [editTemplatePopUpOpen, setEditTemplatePopUpOpen] = useState<boolean>(false);

  const [templateToEdit, setTemplateToEdit] = useState<Template>();

  const { currentUser } = useAuth();

  const deleteTemplate = async (template: Template) => {
    try {
      await deleteDoc(doc(db, 'templates', template.id));
      props.setUserTemplates(props.userTemplates.filter((templateI) => templateI.id !== template.id));
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  return (
    <div className="page-root">
      <div className="page-header">
        <h1 className="page-header-title">My Templates</h1>
        <button
          className="submit-button"
          onClick={() => {
            setNewTemplatePopUpOpen(true);
          }}
        >
          New Template
        </button>
      </div>
      {props.loading ? (
        <Loader />
      ) : (
        props.userTemplates.map((template) => (
          <div className="list-row" key={template.id}>
            <div className="list-row-content">
              <p className="list-row-title">{template.name}</p>
              <p>{template.template}</p>
            </div>
            <div className="list-row-button-group">
              <button
                className="list-row-button"
                onClick={() => {
                  setEditTemplatePopUpOpen(true);
                  setTemplateToEdit(template);
                }}
              >
                Edit
              </button>
              <button className="list-row-button" onClick={async () => await deleteTemplate(template)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <Dialog fullWidth sx={{ width: 1 }} open={newTemplatePopUpOpen} onClose={() => setNewTemplatePopUpOpen(false)}>
        <TemplateInput
          currentUser={currentUser}
          userTemplates={props.userTemplates}
          setUserTemplates={props.setUserTemplates}
          setPopUpOpen={setNewTemplatePopUpOpen}
        />
      </Dialog>
      <Dialog fullWidth sx={{ width: 1 }} open={editTemplatePopUpOpen} onClose={() => setEditTemplatePopUpOpen(false)}>
        <TemplateInput
          currentUser={currentUser}
          userTemplates={props.userTemplates}
          setUserTemplates={props.setUserTemplates}
          setPopUpOpen={setEditTemplatePopUpOpen}
          existingTemplate={templateToEdit}
        />
      </Dialog>
    </div>
  );
};

export default Templates;
