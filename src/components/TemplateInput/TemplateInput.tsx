import './TemplateInput.css';

import { logEvent } from 'firebase/analytics';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { analytics, db } from '../../firebase';
import { emptyTemplate, Template } from '../../interface';

interface TemplateInputProps {
  currentUser: any;
  existingTemplate?: Template;
  setUserTemplates: Dispatch<SetStateAction<Template[]>>;
  userTemplates: Template[];
  setPopUpOpen?: Dispatch<SetStateAction<boolean>>;
}

const TemplateInput = (props: TemplateInputProps) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(
    props.existingTemplate ? props.existingTemplate : emptyTemplate
  );
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const addTemplate = async () => {
    setButtonDisabled(true);
    const templateRef = doc(collection(db, 'templates'));
    const templateToAdd: Template = {
      id: templateRef.id,
      name: currentTemplate.name,
      template: currentTemplate.template,
      user: props.currentUser.email,
    };
    try {
      await setDoc(templateRef, templateToAdd);
      props.setUserTemplates((oldUserTemplates) => [...oldUserTemplates, templateToAdd]);
      props.setPopUpOpen?.(false);
      logEvent(analytics, 'template_created');
    } catch (e) {
      alert('There was an error, try again');
    }
    setButtonDisabled(false);
  };

  const editTemplate = async (template: Template, editedTemplate: string) => {
    setButtonDisabled(true);
    const templateRef = doc(db, 'templates', template.id);
    try {
      await updateDoc(templateRef, { ...currentTemplate });
      props.setUserTemplates([
        ...props.userTemplates.map((templateI) => {
          if (templateI.id === template.id) {
            return { ...currentTemplate };
          }
          return templateI;
        }),
      ]);
      props.setPopUpOpen?.(false);
    } catch (e) {
      alert('There was an error, try again');
    }
    setButtonDisabled(false);
  };

  return (
    <div className="template-form-root">
      <p className="form-title">{props.existingTemplate ? 'Edit Template' : 'New Template'}</p>
      <div className="form-description-container">
        <p>
          Type in {'{recruiter}'} in place of where you want to type in the {"recruiter's"} first name for your email
          and it will get substituted into the email draft when you click the email button next to the {"recruiter's"}{' '}
          name. Same concept goes for {'{company}'} and the company name
        </p>
      </div>
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

      <textarea
        className="template-form-text-area"
        placeholder={props.existingTemplate ? 'Edit Template' : 'Start Writing Here...'}
        onChange={(e) => {
          setCurrentTemplate({ ...currentTemplate, template: e.target.value });
        }}
        value={currentTemplate.template}
      />
      <button
        className="submit-button"
        onClick={async () =>
          props.existingTemplate
            ? await editTemplate(props.existingTemplate, currentTemplate?.template)
            : await addTemplate()
        }
        disabled={
          (currentTemplate.template === props.existingTemplate?.template &&
            currentTemplate.name === props.existingTemplate?.name) ||
          currentTemplate.name === '' ||
          currentTemplate.template === '' ||
          buttonDisabled
        }
      >
        Done
      </button>
    </div>
  );
};

export default TemplateInput;
