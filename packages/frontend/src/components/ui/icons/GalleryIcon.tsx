import React from 'react';
import IconWrapper from '../IconWrapper';

interface GalleryIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Gallery icon component
 */
const GalleryIcon: React.FC<GalleryIconProps> = ({ className = '', size = 'md' }) => {
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
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </IconWrapper>
  );
};

export default GalleryIcon;
