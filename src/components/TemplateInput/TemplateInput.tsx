import './TemplateInput.css';

import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { isEmpty, isEqual, xorWith } from 'lodash';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { db } from '../../firebase';
import {
  emptyTemplate,
  emptyVariable,
  Template,
  Variable,
} from '../../interface';

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
  const [newVariable, setNewVariable] = useState<Variable>(emptyVariable);

  const varsEqaul = (
    var1: Variable[] | undefined,
    var2: Variable[] | undefined
  ): boolean => {
    return isEmpty(xorWith(var1, var2, isEqual));
  };

  const addTemplate = async () => {
    const templateRef = doc(collection(db, 'templates'));
    const templateToAdd: Template = {
      id: templateRef.id,
      name: currentTemplate.name,
      template: currentTemplate.template,
      user: props.currentUser.email,
      variables: currentTemplate.variables,
    };

    await setDoc(templateRef, templateToAdd)
      .then(() => {
        props.setUserTemplates((oldUserTemplates) => [
          ...oldUserTemplates,
          templateToAdd,
        ]);
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
      <p className="form-title">
        {props.existingTemplate ? 'Edit Template' : 'New Template'}
      </p>
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
      <div className="template-form-sub-container">
        <p className="form-subtitle">Create Variables</p>
        {/* eslint-disable-next-line @typescript-eslint/prefer-optional-chain */}
        {currentTemplate.variables.map((variable) => (
          <div className="tag" key={variable.name}>
            <div className="tag-text">
              <p>{variable.name} </p>
              <p>=</p>
              <p> {variable.value}</p>
            </div>

            <button
              className="template-form-button"
              onClick={() => {
                setCurrentTemplate((oldCurrentTemplate) => ({
                  ...oldCurrentTemplate,
                  variables: oldCurrentTemplate.variables.filter(
                    (variableI) =>
                      variableI.name !== variable.name &&
                      variableI.value !== variable.value
                  ),
                }));
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <div className="template-form-sub-container-list">
          <input
            className="template-form-special"
            placeholder="New Variable Name"
            value={newVariable.name}
            onChange={(e) =>
              setNewVariable({ ...newVariable, name: e.target.value })
            }
          />
          <input
            placeholder="New Value"
            value={newVariable.value}
            onChange={(e) =>
              setNewVariable({ ...newVariable, value: e.target.value })
            }
          />
        </div>

        <button
          className="template-form-button"
          onClick={() => {
            setCurrentTemplate((oldCurrentTemplate) => ({
              ...oldCurrentTemplate,
              variables: [...oldCurrentTemplate.variables, newVariable],
            }));
            setNewVariable({ name: '', value: '' });
          }}
          disabled={newVariable.value === '' || newVariable.name === ''}
        >
          Add Variable
        </button>
      </div>

      <p className="form-subtitle">Edit Template</p>
      <textarea
        className="template-form-text-area"
        placeholder={
          props.existingTemplate ? 'Edit Template' : 'Start Writing Here...'
        }
        onChange={(e) => {
          setCurrentTemplate({ ...currentTemplate, template: e.target.value });
        }}
        value={currentTemplate.template}
      />
      <button
        className="template-form-button"
        onClick={async () =>
          props.existingTemplate
            ? await editTemplate(
                props.existingTemplate,
                currentTemplate?.template
              )
            : await addTemplate()
        }
        disabled={
          (currentTemplate.template === props.existingTemplate?.template &&
            varsEqaul(
              props.existingTemplate?.variables,
              currentTemplate.variables
            ) &&
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
