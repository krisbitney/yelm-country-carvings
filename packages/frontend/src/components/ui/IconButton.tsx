import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonVariant = 'primary' | 'secondary' | 'accent' | 'light';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
  ariaLabel: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * A reusable icon button component with different variants and sizes
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  onClick,
  ...props
}) => {
  // Base classes for all icon buttons
  const baseClasses =
    'rounded-full shadow-md flex items-center justify-center transition-colors duration-300';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-neutral-light hover:bg-primary-dark',
    secondary: 'bg-secondary text-neutral-light hover:bg-secondary-dark',
    accent: 'bg-accent text-neutral-light hover:bg-accent-dark',
    light: 'bg-white text-neutral-dark hover:bg-neutral-light',
  };

  // Size-specific classes
  const sizeClasses = {
    sm: 'p-1.5 w-8 h-8',
    md: 'p-2 w-10 h-10',
    lg: 'p-3 w-12 h-12',
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
      {...props}
    >
      <div className={iconSizeClasses[size]}>{icon}</div>
    </button>
  );
};

export default IconButton;
