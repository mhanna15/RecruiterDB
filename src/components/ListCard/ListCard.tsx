import './ListCard.css';

import React from 'react';

import { RecruiterType } from '../../interface';

const ListCard = (props: { recruiter: RecruiterType }) => {
  return (
    <div className="list-card-root">
      <p>
        {props.recruiter.firstName} {props.recruiter.lastName}
      </p>
      <p>email: {props.recruiter.email}</p>
      <p>company: {props.recruiter.company}</p>
      <p>title: {props.recruiter.title}</p>
      <p>linkedIn: {props.recruiter.linkedIn}</p>
    </div>
  );
};

export default ListCard;
