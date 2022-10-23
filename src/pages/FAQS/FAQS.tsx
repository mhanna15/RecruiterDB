import React from 'react';
import { useNavigate } from 'react-router-dom';

import faqAllowHandler from './images/faqAllowHandler.jpg';
import protocolhandlers from './images/protocolhandlers.png';

const FAQs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>FAQs</h1>
      <h2>How do I use the app?</h2>
      <p>
        The goal of this app is to make emailing recruiters much easier. We do this by allowing users to create
        templates with variables whose values will change with the recruiter you are trying to email. After creating a
        template under the <a onClick={() => navigate('/templates')}>Templates</a> tab, you can go back to{' '}
        <a onClick={() => navigate('/')}>Home</a> and select that new template in the drop down menu next to a{' '}
        {"recruiter's"} name and then click the email button, which will open a prefilled email draft with your template
      </p>
      <h2>{"The mail button isn't working"}</h2>
      <p>
        If you are using chrome, go to chrome://settings/handlers in a new tab, make sure the{' '}
        {'"Sites can ask to handle protocols option is selected"'}
        <img
          src={protocolhandlers}
          style={{ display: 'flex', margin: 'auto', padding: '1em' }}
          height="200px"
          width="450px"
        />
        Then, open{' '}
        <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noreferrer">
          Gmail
        </a>{' '}
        and check allow as shown below
        <img
          src={faqAllowHandler}
          style={{ display: 'flex', margin: 'auto', paddingTop: '1em' }}
          height="200px"
          width="270px"
        />
      </p>
    </div>
  );
};

export default FAQs;
