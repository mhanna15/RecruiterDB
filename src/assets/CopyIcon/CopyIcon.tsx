import * as React from 'react';

const CopyIcon = (props: { disabled: boolean }) => (
  <svg
    width={20}
    height={22}
    fill={props.disabled ? 'lightgray' : '#878787'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5 0h-11C1.4 0 .5.9.5 2v13c0 .55.45 1 1 1s1-.45 1-1V3c0-.55.45-1 1-1h10c.55 0 1-.45 1-1s-.45-1-1-1Zm4 4h-11c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm-10 16h9c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1h-9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1Z"
      fillOpacity={1}
    />
  </svg>
);

export default CopyIcon;
