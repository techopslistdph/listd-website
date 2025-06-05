'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
        <ProgressBar
        height="4px"
        color="#33239f"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
  
    </>
  );
};

export default ProgressBarProviders;