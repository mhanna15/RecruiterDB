export interface RecruiterType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  linkedIn: string;
  seenBy: string[];
  dateAddedMillis: number;
  addedBy: string;
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
  seenBy: [],
  dateAddedMillis: new Date().getTime(),
  addedBy: '',
};
