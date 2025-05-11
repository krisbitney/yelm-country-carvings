import React from 'react';
import logoImage from '../../../assets/logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-12' }) => {
  return (
    <div className={`${className} flex items-center`}>
      <img 
        src={logoImage} 
        alt="Yelm Country Carvings Logo" 
        className="h-full object-contain"
      />
    </div>
  );
};

export default Logo;
