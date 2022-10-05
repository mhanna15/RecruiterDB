import Dialog from '@mui/material/Dialog';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import TemplateInput from '../../components/TemplateInput/TemplateInput';
import { db } from '../../firebase';
import { Template } from '../../interface';
import './Templates.css';

const Templates = () => {
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);

  const [newTemplatePopUpOpen, setNewTemplatePopUpOpen] =
    useState<boolean>(false);
  const [editTemplatePopUpOpen, setEditTemplatePopUpOpen] =
    useState<boolean>(false);

  const [templateToEdit, setTemplateToEdit] = useState<Template>();

  const [message, setMessage] = useState<string>('');

  const { currentUser } = useAuth();

  const deleteTemplate = async (template: Template) => {
    await deleteDoc(doc(db, 'templates', template.id))
      .then(() =>
        setUserTemplates(
          userTemplates.filter((templateI) => templateI.id !== template.id)
        )
      )
      .catch((e) => setMessage(JSON.stringify(e)));
  };

  useEffect(() => {
    console.log('fetching templates');
    const getTemplates = async () => {
      const q = query(
        collection(db, 'templates'),
        where('user', '==', currentUser.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserTemplates((current) => [...current, doc.data() as Template]);
      });
    };
    getTemplates().catch((e) => setMessage(JSON.stringify(e)));
    // setUserTemplates(['template 1 here', 'template 2 here']);
  }, []);

  return (
    <div>
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

      {userTemplates.map((template) => (
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
            <button
              className="list-row-button"
              onClick={async () => await deleteTemplate(template)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <Dialog
        open={newTemplatePopUpOpen}
        onClose={() => setNewTemplatePopUpOpen(false)}
      >
        <TemplateInput
          currentUser={currentUser}
          userTemplates={userTemplates}
          setUserTemplates={setUserTemplates}
          setPopUpOpen={setNewTemplatePopUpOpen}
          setMessage={setMessage}
        />
      </Dialog>
      <Dialog
        open={editTemplatePopUpOpen}
        onClose={() => setEditTemplatePopUpOpen(false)}
      >
        <TemplateInput
          currentUser={currentUser}
          userTemplates={userTemplates}
          setUserTemplates={setUserTemplates}
          setPopUpOpen={setEditTemplatePopUpOpen}
          setMessage={setMessage}
          existingTemplate={templateToEdit}
        />
      </Dialog>
      {message}
    </div>
  );
};

export default Templates;
