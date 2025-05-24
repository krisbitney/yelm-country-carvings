import React, { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react';

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
 * Includes accessibility improvements for keyboard navigation and screen readers
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  disabled,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses =
    'inline-block font-body font-bold rounded-md shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-neutral-light hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-neutral-light hover:bg-secondary-dark focus:ring-secondary',
    accent: 'bg-accent text-neutral-light hover:bg-accent-dark focus:ring-accent',
  };

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Disabled state classes
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  // Render as anchor if href is provided, otherwise as button
  if (href) {
    // Extract button-specific props that don't apply to anchors
    const { ...anchorProps } = props;

    return (
      <a
        href={disabled ? undefined : href}
        className={buttonClasses}
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : 0}
        role="button"
        {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
