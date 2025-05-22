import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  href?: string;
}

/**
 * A reusable button component with different variants and sizes
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses =
    'inline-block font-body font-bold rounded-md shadow-md transition-colors duration-300';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-neutral-light hover:bg-primary-dark',
    secondary: 'bg-secondary text-neutral-light hover:bg-secondary-dark',
    accent: 'bg-accent text-neutral-light hover:bg-accent-dark',
  };

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Render as anchor if href is provided, otherwise as button
  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
