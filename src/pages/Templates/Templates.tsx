import Dialog from '@mui/material/Dialog';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import TemplateInput from '../../components/TemplateInput/TemplateInput';
import { db } from '../../firebase';

const Templates = () => {
  const [userTemplates, setUserTemplates] = useState<string[]>([]);

  const [newTemplatePopUpOpen, setNewTemplatePopUpOpen] =
    useState<boolean>(false);
  const [editTemplatePopUpOpen, setEditTemplatePopUpOpen] =
    useState<boolean>(false);

  const [templateToEdit, setTemplateToEdit] = useState<string>('');

  const [message, setMessage] = useState<string>('');

  const { currentUser } = useAuth();

  const deleteTemplate = async (template: string) => {
    const userRef = doc(db, 'users', currentUser.email);
    await updateDoc(userRef, {
      templates: arrayRemove(template),
    })
      .then(() =>
        setUserTemplates(
          userTemplates.filter((templateI) => templateI !== template)
        )
      )
      .catch((e) => setMessage(JSON.stringify(e)));
  };

  useEffect(() => {
    console.log('fetching templates');
    const getTemplates = async () => {
      const userRef = doc(db, 'users', currentUser.email);
      const userSnap = await getDoc(userRef);
      return userSnap.data()?.templates;
    };
    getTemplates()
      .then((templates) => setUserTemplates(templates))
      .catch((e) => setMessage(JSON.stringify(e)));
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
        <div key={template}>
          <div>{template}</div>
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
          setUserTemplates={setUserTemplates}
          setPopUpOpen={setNewTemplatePopUpOpen}
          setMessage={setMessage}
          deleteTemplate={deleteTemplate}
        />
      </Dialog>
      <Dialog
        open={editTemplatePopUpOpen}
        onClose={() => setEditTemplatePopUpOpen(false)}
      >
        <TemplateInput
          currentUser={currentUser}
          setUserTemplates={setUserTemplates}
          setPopUpOpen={setEditTemplatePopUpOpen}
          setMessage={setMessage}
          deleteTemplate={deleteTemplate}
          existingTemplate={templateToEdit}
        />
      </Dialog>
      {message}
    </div>
  );
};

export default Templates;
