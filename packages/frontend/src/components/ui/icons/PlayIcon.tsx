import React from 'react';
import IconWrapper from '../IconWrapper';

interface PlayIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Play icon component
 */
const PlayIcon: React.FC<PlayIconProps> = ({ className = '', size = 'md' }) => {
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
        strokeWidth={1.5}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </IconWrapper>
  );
};

export default PlayIcon;