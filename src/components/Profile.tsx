import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1>profile page</h1>
      <p>email: {currentUser.email}</p>
    </div>
  );
};

export default Profile;
