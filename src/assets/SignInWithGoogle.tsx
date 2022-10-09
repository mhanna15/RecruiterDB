import React from 'react';

interface Google {
  onClick?: React.MouseEventHandler;
}

const SignInWithGoogle = (props: Google) => {
  return (
    <button onClick={props.onClick} className="google-sign-in">
      <img className="google-sign-in-logo" src={require('./GoogleLogo.png')} />
      <p className="google-sign-in-text ">Login With Google</p>
    </button>
  );
};

export default SignInWithGoogle;
