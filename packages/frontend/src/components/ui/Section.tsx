import React, { ReactNode } from 'react';
import { SectionHeader } from './index';

interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  background?: 'light' | 'dark' | 'accent' | 'none';
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * A reusable section component with standardized layout
 */
const Section: React.FC<SectionProps> = ({
  id,
  title,
  description,
  icon,
  className = '',
  background = 'light',
  children,
  footer,
}) => {
  // Background classes based on the background prop
  const backgroundClasses = {
    light: 'bg-[#F5F1E9]',
    dark: 'bg-[#3E3C3B] text-[#F5F1E9]',
    accent: 'bg-[#4A6151] text-[#F5F1E9]',
    none: '',
  };

  return (
    <section id={id} className={`py-16 ${backgroundClasses[background]} ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={icon}
          title={title}
          description={description}
        />

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-12">{footer}</div>}
      </div>
    </section>
  );
};

export default Section;
