import * as React from 'react';

const DeleteIcon = (props: { disabled: boolean }) => (
  <svg
    width={14}
    height={18}
    fill={props.disabled ? 'lightgray' : '#878787'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5 1H13c.55 0 1 .45 1 1s-.45 1-1 1H1c-.55 0-1-.45-1-1s.45-1 1-1h2.5l.71-.71c.18-.18.44-.29.7-.29h4.18c.26 0 .52.11.7.29l.71.71ZM3 18c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H3Z"
      fillOpacity={1}
    />
  </svg>
);

export default DeleteIcon;
