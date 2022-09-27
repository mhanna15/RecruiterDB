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
      <h1>Templates pages</h1>
      <button
        onClick={() => {
          setNewTemplatePopUpOpen(true);
        }}
      >
        create a new template
      </button>
      {userTemplates.map((template) => (
        <div key={template.id}>
          <div>{template.template}</div>
          <button onClick={async () => await deleteTemplate(template)}>
            delete template
          </button>
          <button
            onClick={() => {
              setEditTemplatePopUpOpen(true);
              setTemplateToEdit(template);
            }}
          >
            edit template
          </button>
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
