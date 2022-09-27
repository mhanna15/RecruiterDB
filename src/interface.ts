export interface RecruiterType {
  name: string;
  email: string;
  company: string;
  title: string;
  linkedIn: string;
}

export interface Company {
  name: string;
  domain: string;
  logo: string;
}

export interface Variable {
  name?: string;
  value?: string;
}

export interface Template {
  id: string;
  name: string;
  template: string;
  variables: Variable[];
  user: string;
}

export const emptyVariable = {
  name: '',
  value: '',
};

export const emptyTemplate = {
  id: '',
  name: '',
  template: '',
  user: '',
  variables: [],
};
