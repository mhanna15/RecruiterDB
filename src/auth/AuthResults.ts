import { AuthError } from 'firebase/auth';

const createResultObject = (title: string, errorMessage: string) => {
  return {
    title,
    errorMessage,
  };
};

const AuthResults = (error: AuthError) => {
  switch (error?.code) {
    case undefined: // Login or SignUp Succeeded
      return;
    case 'auth/email-already-exists':
      return createResultObject('Email Already in Use', 'This email is already in use');
    case 'auth/invalid-email':
      return createResultObject('Invalid Email', 'The email provided is not a valid email');
    case 'auth/invalid-password':
      return createResultObject('Weak Password', 'Password must have at least 6 characters');
    case 'auth/user-not-found':
      return createResultObject('Email not found', 'No account with this email exists');
    case 'auth/email-already-in-use':
      return createResultObject('Account already exists', 'The email provided is already in use');
    default:
      return createResultObject('Wrong Credentials', 'Double check your username and password');
  }
};

export default AuthResults;
