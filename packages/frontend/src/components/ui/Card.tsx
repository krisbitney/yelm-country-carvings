import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  image?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  bordered?: boolean;
}

/**
 * A reusable card component with image, title, and content
 */
const Card: React.FC<CardProps> = ({
  title,
  image,
  children,
  className = '',
  onClick,
  hoverEffect = true,
  bordered = false,
}) => {
  // Base classes for all cards
  const baseClasses = 'bg-[#F5F1E9] p-6 rounded-lg shadow-md';
  
  // Hover effect classes
  const hoverClasses = hoverEffect 
    ? 'hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1' 
    : '';
  
  // Border classes
  const borderClasses = bordered 
    ? 'border-2 border-[#A07E5D]' 
    : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${borderClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {image && (
        <div className="mb-4 flex justify-center">
          {image}
        </div>
      )}
      
      {title && (
        <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">
          {title}
        </h3>
      )}
      
      <div className="font-['Lato'] text-[#3E3C3B]">
        {children}
      </div>
    </div>
  );
};

export default Card;