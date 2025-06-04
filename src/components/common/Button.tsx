import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary:
    'bg-primary-main text-white border border-primary-main hover:bg-secondary-main',
  secondary:
    'bg-secondary-main text-white border-transparent hover:bg-secondary-mid',
  outlined:
    'bg-white text-primary-main border-2 border-primary-main hover:bg-primary-light',
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
  const classes = cn(
    'flex items-center gap-2 rounded-full px-6 py-2 transition-colors duration-200 cursor-pointer',
    disabled ? variantClasses.disabled : variantClasses[variant],
    className
  );

  return (
    <button className={classes} disabled={disabled} {...props}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
