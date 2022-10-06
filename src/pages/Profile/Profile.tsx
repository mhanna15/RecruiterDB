import './Profile.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { handleLogout } from '../../auth/authFunctions';

const Profile = () => {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');

  return (
    <div className="page-root">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <p className="profile-field">Email: {currentUser?.email}</p>
      </div>
      <button onClick={async (e) => await handleLogout(e, logout, navigate, setError)}>Sign Out</button>
      {error}
    </div>
  );
};

export default Profile;
