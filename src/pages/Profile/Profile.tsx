import './Profile.css';

import { Alert } from '@mui/material';
import React from 'react';

import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const Profile = () => {
  const { currentUser, logout, sendEmailForVerification } = useAuth();

  const handleLogout = async () => {
    const res = await logout();
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
    }
  };

  return (
    <div className="page-root">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <p className="profile-field">Email: {currentUser?.email}</p>
      </div>
      {currentUser?.emailVerified ? (
        <></>
      ) : (
        <>
          <Alert severity="warning">
            In order to use our app, your email must be verified. Check email (may be in spam) for verification link.
            After clicking link, refresh page to gain full access
          </Alert>
          {/* <button onClick={sendEmailForVerification}>Verify My Account</button> */}
        </>
      )}
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default Profile;
