import React from 'react';
import IconWrapper from '../IconWrapper';

interface BackIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Back icon component
 */
const BackIcon: React.FC<BackIconProps> = ({ className = '', size = 'md' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Base classes
  const baseClasses = `${sizeClasses[size]} ${className}`;

  return (
    <IconWrapper className={baseClasses}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </IconWrapper>
  );
};

export default BackIcon;