import React from 'react';

export function Container({
  id,
  children,
  backgroundImage = '',
  position,
  styling = {},
  className = '',
}: Readonly<{
  id?: string;
  children?: React.ReactNode;
  backgroundImage?: string;
  styling?: object;
  position?: string;
  className?: string;
}>) {
  let style: object = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundPosition: position ?? 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  if (styling) {
    style = { ...style, ...styling };
  }

  return (
    <div id={id} style={style} className={`relative ${className}`}>
      <div
        className={`container max-w-[1300px] mx-auto px-8 md:px-5 text-neutral-text flex py-10 lg:py-20 flex-col justify-center items-center`}
      >
        {children}
      </div>
    </div>
  );
}
