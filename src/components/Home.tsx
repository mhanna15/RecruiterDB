import { doc, setDoc } from 'firebase/firestore';
import React from 'react';

const Home = (props: { isLoggedIn: boolean }) => {
  const addRecruiter = (
    name: string,
    company: string,
    email: string,
    linkedIn: string
  ) => {};
  return (
    <div>
      <h1>{props.isLoggedIn ? 'logged in homepage' : 'logged out homepage'}</h1>
    </div>
  );
};

export default Home;
