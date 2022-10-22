import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        If you are using chrome, go to chrome://settings/handlers in a new tab, look under the email section, click the
        3 dots next to mail.google.com, and select it as default
      </p>
    </div>
  );
};

export default FAQs;
