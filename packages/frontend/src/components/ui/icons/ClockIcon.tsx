import React from 'react';
import IconWrapper from '../IconWrapper';

interface ClockIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Clock icon component
 */
const ClockIcon: React.FC<ClockIconProps> = ({ className = '', size = 'md' }) => {
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </IconWrapper>
  );
};

export default ClockIcon;