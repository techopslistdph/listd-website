import React from 'react';

type TSvgIconProps = {
  className: string;
};

const DrawOnMapIcon = (props: TSvgIconProps) => {
  return (
    <svg
      {...props}
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12.5 19L19.5 12L22.5 15L15.5 22L12.5 19Z'
        stroke='#EDEDED'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.5 13L17 5.5L2.5 2L6 16.5L13.5 18L18.5 13Z'
        stroke='#EDEDED'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2.5 2L10.086 9.586'
        stroke='#EDEDED'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.5 13C12.6046 13 13.5 12.1046 13.5 11C13.5 9.89543 12.6046 9 11.5 9C10.3954 9 9.5 9.89543 9.5 11C9.5 12.1046 10.3954 13 11.5 13Z'
        stroke='#EDEDED'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default DrawOnMapIcon;
