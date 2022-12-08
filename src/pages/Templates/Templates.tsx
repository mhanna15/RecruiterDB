import './Templates.css';

import Dialog from '@mui/material/Dialog';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

// analytics
import mixpanel from 'mixpanel-browser';
import config from '../../config';

import DeleteIcon from '../../assets/DeleteIcon/DeleteIcon';
import EditIcon from '../../assets/EditIcon/EditIcon';
import { useAuth } from '../../auth/AuthContext';
import Loader from '../../components/Loader/Loader';
import TemplateInput from '../../components/TemplateInput/TemplateInput';
import { db } from '../../firebase';
import { Template } from '../../interface';

const Templates = (props: {
  userTemplates: Template[];
  setUserTemplates: Dispatch<SetStateAction<Template[]>>;
  loading: boolean;
}) => {
  const [newTemplatePopUpOpen, setNewTemplatePopUpOpen] = useState<boolean>(false);
  const [editTemplatePopUpOpen, setEditTemplatePopUpOpen] = useState<boolean>(false);
  const [deleteTemplatePopUpOpen, setDeleteTemplatePopUpOpen] = useState<boolean>(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState<boolean>(false);

  const [templateToEdit, setTemplateToEdit] = useState<Template>();
  const [templateToDelete, setTemplateToDelete] = useState<Template>();

  const { currentUser } = useAuth();
  mixpanel.init(config.apiKey);

  const deleteTemplate = async (template: Template) => {
    setDeleteButtonDisabled(true);
    try {
      await deleteDoc(doc(db, 'templates', template.id));
      props.setUserTemplates(props.userTemplates.filter((templateI) => templateI.id !== template.id));
      setDeleteTemplatePopUpOpen(false);
    } catch (e) {
      alert('There was an error, try again');
    }
    setDeleteButtonDisabled(false);
  };

  return (
    <div className="page-root">
      <div className="page-header">
        <h1 className="page-header-title" style={{ marginBottom: '1em' }}>
          My Email Templates
        </h1>
        <button
          className="submit-button"
          onClick={() => {
            mixpanel.track('Create New Template', {});
            setNewTemplatePopUpOpen(true);
          }}
        >
          Create Email Template
        </button>
      </div>
      {props.loading ? (
        <Loader />
      ) : (
        <>
          {props.userTemplates.length !== 0 ? (
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
                    <EditIcon disabled={false} />
                  </button>
                  <button
                    className="list-row-button list-row-button-right"
                    onClick={() => {
                      setTemplateToDelete(template);
                      setDeleteTemplatePopUpOpen(true);
                    }}
                  >
                    <DeleteIcon disabled={false} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
              You have no templates, create one by clicking Create Email Template
            </p>
          )}
        </>
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
      <Dialog
        fullWidth
        sx={{ width: 1 }}
        open={deleteTemplatePopUpOpen}
        onClose={() => setDeleteTemplatePopUpOpen(false)}
      >
        <div className="form">
          <h1>Are you sure you want to delete?</h1>
          <div className="form-button-container">
            <button className="form-button form-button-left" onClick={() => setDeleteTemplatePopUpOpen(false)}>
              Cancel
            </button>
            <button
              className="form-button"
              disabled={deleteButtonDisabled}
              onClick={async () => templateToDelete && (await deleteTemplate(templateToDelete))}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Templates;
