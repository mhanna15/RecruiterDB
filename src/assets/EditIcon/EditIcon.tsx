import React from 'react';

const EditIcon = (props: { disabled: boolean }) => (
  <svg
    width={24}
    height={24}
    fill={props.disabled ? 'lightgray' : '#878787'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.71 4.042a.996.996 0 0 0 0-1.41L18.37.292a.996.996 0 0 0-1.41 0L15 2.252l3.75 3.75 1.96-1.96Zm-2.96 2.96L14 3.252l-9.85 9.85c-.1.1-.15.22-.15.36V16.5c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.75 7ZM22 20H2c-1.1 0-2 .9-2 2s.9 2 2 2h20c1.1 0 2-.9 2-2s-.9-2-2-2Z"
      fillOpacity={1}
    />
  </svg>
);

export default EditIcon;
