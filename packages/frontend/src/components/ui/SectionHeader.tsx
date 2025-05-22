import React, { ReactNode } from 'react';

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

/**
 * A reusable section header component with an optional icon and description
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {icon && <div className="mx-auto mb-4">{icon}</div>}

      <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">{title}</h2>

      {description && (
        <p className="font-body text-lg text-neutral-dark mt-3 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
