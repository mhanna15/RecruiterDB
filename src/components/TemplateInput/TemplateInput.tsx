import './TemplateInput.css';

import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { db } from '../../firebase';
import { emptyTemplate, Template } from '../../interface';

interface TemplateInputProps {
  currentUser: any;
  existingTemplate?: Template;
  setUserTemplates: Dispatch<SetStateAction<Template[]>>;
  userTemplates: Template[];
  setPopUpOpen?: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const TemplateInput = (props: TemplateInputProps) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(
    props.existingTemplate ? props.existingTemplate : emptyTemplate
  );

  const addTemplate = async () => {
    const templateRef = doc(collection(db, 'templates'));
    const templateToAdd: Template = {
      id: templateRef.id,
      name: currentTemplate.name,
      template: currentTemplate.template,
      user: props.currentUser.email,
    };

    await setDoc(templateRef, templateToAdd)
      .then(() => {
        props.setUserTemplates((oldUserTemplates) => [...oldUserTemplates, templateToAdd]);
        props.setPopUpOpen?.(false);
      })
      .catch((e) => props.setMessage(JSON.stringify(e)));
  };

  const editTemplate = async (template: Template, editedTemplate: string) => {
    const templateRef = doc(db, 'templates', template.id);
    await updateDoc(templateRef, { ...currentTemplate })
      .then(() => {
        props.setUserTemplates([
          ...props.userTemplates.map((templateI) => {
            if (templateI.id === template.id) {
              return { ...currentTemplate };
            }
            return templateI;
          }),
        ]);
        props.setPopUpOpen?.(false);
      })
      .catch((e) => props.setMessage(JSON.stringify(e)));
  };

  return (
    <div className="template-form-root">
      <p className="form-title">{props.existingTemplate ? 'Edit Template' : 'New Template'}</p>
      <input
        placeholder="Template Name"
        value={currentTemplate.name}
        onChange={(e) => {
          setCurrentTemplate((oldCurrentTemplate) => ({
            ...oldCurrentTemplate,
            name: e.target.value,
          }));
        }}
      />
      <p className="form-subtitle">Edit Template</p>
      <textarea
        className="template-form-text-area"
        placeholder={props.existingTemplate ? 'Edit Template' : 'Start Writing Here...'}
        onChange={(e) => {
          setCurrentTemplate({ ...currentTemplate, template: e.target.value });
        }}
        value={currentTemplate.template}
      />
      <button
        className="template-form-button"
        onClick={async () =>
          props.existingTemplate
            ? await editTemplate(props.existingTemplate, currentTemplate?.template)
            : await addTemplate()
        }
        disabled={
          (currentTemplate.template === props.existingTemplate?.template &&
            currentTemplate.name === props.existingTemplate?.name) ||
          currentTemplate.name === '' ||
          currentTemplate.template === ''
        }
      >
        Done
      </button>
    </div>
  );
};

export default TemplateInput;
