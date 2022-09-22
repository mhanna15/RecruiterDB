import React, { Dispatch, SetStateAction, useState } from 'react';
import './ListCard.css';

const ListCard = (props: {
  name: string | undefined;
  email: string | undefined;
  company: string | undefined;
  title: string | undefined;
  linkedIn: string | undefined;
}) => {
  return (
    <div className="list-card-root">
      <p>{props?.name}</p>
      <p>email: {props?.email}</p>
      <p>company: {props?.company}</p>
      <p>title: {props?.title}</p>
      <p>linkedIn: {props?.linkedIn}</p>
    </div>
  );
};

export default ListCard;
