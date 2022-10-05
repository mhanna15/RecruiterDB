import React, { useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { handleLogout } from '../../auth/authFunctions';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');

  return (
    <div>
      <h1>profile page</h1>
      <p>email: {currentUser.email}</p>
      <button
        onClick={async (e) => await handleLogout(e, logout, navigate, setError)}
      >
        Logout
      </button>
      {error}
    </div>
  );
};

export default Profile;
