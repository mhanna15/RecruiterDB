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
    <div>
      <div>
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
        <input
          placeholder="Variable Name"
          value={newVariable.name}
          onChange={(e) =>
            setNewVariable({ ...newVariable, name: e.target.value })
          }
        />
        =
        <input
          placeholder="Value"
          value={newVariable.value}
          onChange={(e) =>
            setNewVariable({ ...newVariable, value: e.target.value })
          }
        />
        <button
          onClick={() => {
            setCurrentTemplate((oldCurrentTemplate) => ({
              ...oldCurrentTemplate,
              variables: [...oldCurrentTemplate.variables, newVariable],
            }));
            setNewVariable({ name: '', value: '' });
          }}
          disabled={newVariable.value === '' || newVariable.name === ''}
        >
          add variable
        </button>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/prefer-optional-chain */}
      {currentTemplate.variables.map((variable) => (
        <div key={variable.name}>
          <p>
            {variable.name}: {variable.value}
          </p>
          <button
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
            remove
          </button>
        </div>
      ))}
      <textarea
        placeholder={
          props.existingTemplate ? 'edit template' : 'add a template'
        }
        onChange={(e) => {
          setCurrentTemplate({ ...currentTemplate, template: e.target.value });
        }}
        value={currentTemplate.template}
      />
      <button
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
        {props.existingTemplate?.template ? 'edit template!' : 'add template!'}
      </button>
    </div>
  );
};

export default TemplateInput;
