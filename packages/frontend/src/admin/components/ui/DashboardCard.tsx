import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  description,
  linkTo,
  linkText,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41]">{title}</h3>
        </div>
        <p className="text-[#3E3C3B] font-['Lato'] mb-6">{description}</p>
        <Link
          to={linkTo}
          className="inline-block px-6 py-3 bg-[#4A6151] text-white font-['Lato'] font-bold rounded-md hover:bg-[#3D5142] transition-colors duration-300"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default DashboardCard;
