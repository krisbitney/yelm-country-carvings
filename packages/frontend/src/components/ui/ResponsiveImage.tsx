import React, { ImgHTMLAttributes } from 'react';

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

/**
 * A reusable component for responsive images with lazy loading
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
  sizes = '100vw',
  onClick,
  ...props
}) => {
  // Normalize the src path
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  // Define aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    '4:3': 'aspect-w-4 aspect-h-3',
    '16:9': 'aspect-w-16 aspect-h-9',
    auto: '',
  };

  // Define object fit classes
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <div className={`${aspectRatioClasses[aspectRatio]} overflow-hidden ${className}`}>
      <img
        src={normalizedSrc}
        alt={alt}
        className={`w-full h-full ${objectFitClasses[objectFit]} ${onClick ? 'cursor-pointer' : ''}`}
        loading="lazy"
        onClick={onClick ? e => onClick(e) : undefined}
        sizes={sizes}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
