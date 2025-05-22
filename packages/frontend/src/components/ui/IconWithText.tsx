import React, { ReactNode } from 'react';

interface IconWithTextProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * A reusable component for displaying an icon with a heading and content
 */
const IconWithText: React.FC<IconWithTextProps> = ({ icon, title, children, className = '' }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="text-primary mr-3 mt-1 flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-body font-bold text-neutral-dark">{title}</h4>
        <div className="font-body text-neutral-dark">{children}</div>
      </div>
    </div>
  );
};

export default IconWithText;
