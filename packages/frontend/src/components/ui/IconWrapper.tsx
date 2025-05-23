import React from 'react';

interface IconWrapperProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * A wrapper component for SVG icons that properly handles className
 */
const IconWrapper: React.FC<IconWrapperProps> = ({ className = '', children }) => {
  return (
    <svg 
      className={className}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

export default IconWrapper;