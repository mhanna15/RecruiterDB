const createResultObject = (title: string, errorMessage: string) => {
  return {
    title,
    errorMessage,
  };
};

const AuthResults = (error: string) => {
  switch (error) {
    case undefined: // Login or SignUp Succeeded
      return;
    case 'auth/weak-password':
      return createResultObject('Weak Password', 'Make a password with 6 or more characters');
    case 'auth/email-already-in-use':
      return createResultObject('Email Already in Use', 'The email you are using is already in use');
    case 'auth/uid-already-exists':
      return createResultObject('User already Exists', 'Try signing in');
    default:
      return createResultObject('Wrong Credentials', 'Double check your username and password');
  }
};

export default AuthResults;
