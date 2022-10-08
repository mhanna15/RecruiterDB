import './Profile.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import AuthResults from '../../auth/AuthResults';

const Profile = () => {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    const authResult = AuthResults(res);
    if (authResult) {
      alert(`${authResult.title}: ${authResult.errorMessage}`);
      return;
    }
    navigate('/login');
  };

  return (
    <div className="page-root">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <p className="profile-field">Email: {currentUser?.email}</p>
      </div>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default Profile;
