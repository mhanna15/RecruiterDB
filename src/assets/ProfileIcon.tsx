import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4c0 2.21-1.79 4-4 4S4 6.21 4 4s1.79-4 4-4 4 1.79 4 4ZM0 14c0-2.66 5.33-4 8-4s8 1.34 8 4v1c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1v-1Z"
      fill="#000"
      fillOpacity={0.54}
    />
  </svg>
);

export default SvgComponent;
