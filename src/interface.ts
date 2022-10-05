export interface RecruiterType {
  id: string;
  firstName: string;
  lastName: string;
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

export interface Template {
  id: string;
  name: string;
  template: string;
  user: string;
}

export const emptyTemplate = {
  id: '',
  name: '',
  template: '',
  user: '',
};

export const emptyRecruiter = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  title: '',
  linkedIn: '',
};
