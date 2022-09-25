import './TemplateInput.css';

import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { db } from '../../firebase';

interface TemplateInputProps {
  currentUser: any;
  existingTemplate?: string;
  setUserTemplates: Dispatch<SetStateAction<string[]>>;
  deleteTemplate: (template: string) => Promise<void>;
  setPopUpOpen?: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const TemplateInput = (props: TemplateInputProps) => {
  const [currentTemplate, setCurrentTemplate] = useState<string>(
    props.existingTemplate ? props.existingTemplate : ''
  );

  const addTemplate = async (template: string) => {
    const userRef = doc(db, 'users', props.currentUser.email);
    await updateDoc(userRef, {
      templates: arrayUnion(template),
    })
      .then(() => {
        props.setUserTemplates((oldUserTemplates) => [
          ...oldUserTemplates,
          template,
        ]);
        props.setPopUpOpen?.(false);
      })
      .catch((e) => props.setMessage(JSON.stringify(e)));
  };

  const editTemplate = async (template: string, editedTemplate: string) => {
    await props
      .deleteTemplate(template)
      .then(async () => {
        await addTemplate(editedTemplate);
      })
      .catch((e) => props.setMessage(JSON.stringify(e)));
  };

  return (
    <div>
      <textarea
        placeholder={
          props.existingTemplate ? 'edit template' : 'add a template'
        }
        onChange={(e) => {
          setCurrentTemplate(e.target.value);
        }}
        value={currentTemplate}
      />
      <button
        onClick={async () =>
          props.existingTemplate
            ? await editTemplate(props.existingTemplate, currentTemplate)
            : await addTemplate(currentTemplate)
        }
        disabled={currentTemplate === props.existingTemplate}
      >
        {props.existingTemplate ? 'edit template!' : 'add template!'}
      </button>
    </div>
  );
};

export default TemplateInput;
