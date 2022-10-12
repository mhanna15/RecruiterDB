import { AuthError } from 'firebase/auth';

const createResultObject = (title: string, errorMessage: string) => {
  return {
    title,
    errorMessage,
  };
};

const AuthResults = (error: AuthError) => {
  switch (error.code) {
    case undefined: // Login or SignUp Succeeded
      return;
    case 'auth/email-already-exists':
      return createResultObject('Email Already in Use', 'This email is already in use');
    case 'auth/invalid-email':
      return createResultObject('Invalid Email', 'The email provided is not a valid email');
    case 'auth/invalid-password':
      return createResultObject('Weak Password', 'Password must have at least 6 characters');
    default:
      return createResultObject('Wrong Credentials', 'Double check your username and password');
  }
};

export default AuthResults;
