import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary:
    'bg-[var(--primary-main)] text-white border-transparent hover:bg-[var(--secondary-main)]',
  secondary:
    'bg-[var(--secondary-main)] text-white border-transparent hover:bg-[var(--secondary-mid)]',
  outlined:
    'bg-white text-[var(--primary-main)] border-2 border-[var(--primary-main)] hover:bg-[var(--primary-light)]',
  disabled: 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'flex items-center gap-2 rounded-full px-6 py-2 transition-colors duration-200 cursor-pointer';
  const classes = [
    baseClasses,
    disabled ? variantClasses.disabled : variantClasses[variant],
    className,
  ].join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
