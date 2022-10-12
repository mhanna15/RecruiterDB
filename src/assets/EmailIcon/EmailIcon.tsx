import React from 'react';

const EmailIcon = (props: { disabled: boolean }) => (
  <svg
    width={20}
    height={16}
    fill={props.disabled ? 'lightgray' : 'gray'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 0H2C.9 0 .01.9.01 2L0 14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2Zm0 13c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V4l6.94 4.34c.65.41 1.47.41 2.12 0L18 4v9ZM2 2l8 5 8-5H2Z"
      fillOpacity={1}
    />
  </svg>
);

export default EmailIcon;
