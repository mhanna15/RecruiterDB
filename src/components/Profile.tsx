import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { logout, currentUser } = useAuth();

  const navigate = useNavigate();

  const handleClick = (e: any) => {
    e.preventDefault();
    logout();
    navigate('/');
  };
  return (
    <div>
      <h1>profile page</h1>
      <p>email: {currentUser.email}</p>
      <button onClick={handleClick}>logout</button>
    </div>
  );
};

export default Profile;
