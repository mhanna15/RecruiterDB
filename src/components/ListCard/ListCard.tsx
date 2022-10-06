import './ListCard.css';

import React from 'react';

import { RecruiterType } from '../../interface';

const ListCard = (props: { recruiter: RecruiterType }) => {
  return (
    <div className="list-card-root">
      <h1 className="list-card-title">
        {props.recruiter.firstName} {props.recruiter.lastName}
      </h1>
      <div className="list-card-row">
        <p className="list-card-subtitle">Email</p>
        <p className="tag-text">{props.recruiter.email}</p>
      </div>
      <div className="list-card-row">
        <p className="list-card-subtitle">Company</p>
        <p className="tag-text">{props.recruiter.company}</p>
      </div>
      <div className="list-card-row">
        <p className="list-card-subtitle">Job Title</p>
        <p className="tag-text">{props.recruiter.title}</p>
      </div>
      <div className="list-card-row">
        <p className="list-card-subtitle">LinkedIn</p>
        <p className="tag-text">{props.recruiter.linkedIn}</p>
      </div>
    </div>
  );
};

export default ListCard;
