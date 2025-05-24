import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * A visually appealing loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  // Determine size class
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }[size];

  // Determine color class
  const colorClass =
    {
      primary: 'border-[#6B4F41]',
      secondary: 'border-[#4A6151]',
      accent: 'border-[#B87351]',
    }[color as 'primary' | 'secondary' | 'accent'] || `border-${color}`;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClass} border-4 border-t-transparent ${colorClass} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      <div className="animate-pulse mt-4 text-[#6B4F41] font-['Lato']">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;
