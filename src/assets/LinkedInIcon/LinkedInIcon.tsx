import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: { disabled: boolean }) => (
  <svg
    width={20}
    height={20}
    fill={props.disabled ? 'lightgray' : 'gray'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.706.081C.906.315.273.961.066 1.752-.024 2.1-.02 17.895.07 18.245c.208.805.879 1.477 1.68 1.683.365.094 16.133.095 16.495.001a2.38 2.38 0 0 0 1.685-1.684c.093-.36.093-16.132 0-16.492A2.381 2.381 0 0 0 18.245.07C17.862-.031 2.048-.02 1.706.08Zm16.275 1.59c.179.096.253.173.357.366.07.132.073.392.073 7.962 0 7.57-.003 7.83-.073 7.962-.104.193-.178.27-.357.365l-.156.084H10c-7.57 0-7.83-.003-7.962-.073-.193-.104-.27-.178-.365-.357l-.084-.156V10c0-7.57.002-7.83.073-7.962.137-.256.295-.376.57-.432.076-.016 3.615-.026 7.865-.023l7.728.006.156.084ZM4.43 3.342c-1.148.373-1.492 1.885-.617 2.712.641.607 1.678.582 2.28-.054C7.22 4.806 5.988 2.833 4.43 3.34Zm8.029 4.253c-.738.17-1.39.576-1.714 1.065l-.12.182V7.696H7.97v8.82h2.646l.02-2.487c.021-2.72.025-2.775.258-3.274.492-1.054 2.143-1.172 2.62-.187.228.47.27 1.072.27 3.929l.002 2.02h2.696l-.013-3.054c-.012-2.765-.02-3.09-.084-3.425-.26-1.344-.878-2.083-1.997-2.386-.386-.104-1.576-.14-1.93-.058ZM3.52 12.107v4.41h2.771v-8.82H3.521v4.41Z"
    />
  </svg>
);

export default SvgComponent;
