import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase';

const Templates = () => {
  const [newTemplate, setNewTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<string[]>([]);

  const [message, setMessage] = useState<string>('');

  const { currentUser } = useAuth();

  const addTemplate = async (template: string) => {
    const userRef = doc(db, 'users', currentUser.email);
    await updateDoc(userRef, {
      templates: arrayUnion(template),
    }).then(() => {
      setTemplates((oldTemplates) => [...oldTemplates, template]);
    });
  };

  const deleteTemplate = async (template: string) => {
    const userRef = doc(db, 'users', currentUser.email);
    await updateDoc(userRef, {
      templates: arrayRemove(template),
    }).then(() =>
      setTemplates(templates.filter((templateI) => templateI !== template))
    );
  };

  useEffect(() => {
    console.log('fetching templates');
    const getTemplates = async () => {
      const userRef = doc(db, 'users', currentUser.email);
      const userSnap = await getDoc(userRef);
      return userSnap.data()?.templates;
    };
    getTemplates()
      .then((templates) => setTemplates(templates))
      .catch((e) => setMessage(e));
    setTemplates(['template 1 here', 'template 2 here']);
  }, []);

  return (
    <div>
      <h1>Templates pages</h1>
      <input
        placeholder="add a template"
        onChange={(e) => {
          setNewTemplate(e.target.value);
        }}
      />
      <button onClick={async () => await addTemplate(newTemplate)}>
        add template!
      </button>
      {templates.map((template) => (
        <div key={template}>
          <div>{template}</div>
          <button onClick={async () => await deleteTemplate(template)}>
            delete template
          </button>
        </div>
      ))}
      {message}
    </div>
  );
};

export default Templates;
