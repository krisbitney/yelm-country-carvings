import React, { ImgHTMLAttributes, useState, useEffect } from 'react';

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  srcSet?: string;
  lowResSrc?: string;
  onClick?: (
    event: React.MouseEvent<HTMLImageElement> | React.KeyboardEvent<HTMLImageElement>
  ) => void;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * A reusable component for responsive images with lazy loading, loading states, and error handling
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
  sizes = '100vw',
  srcSet,
  lowResSrc,
  onClick,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Normalize the src path - only prepend '/' if it's a relative path and doesn't start with '/'
  const isAbsoluteUrl = (url: string) => /^(https?:\/\/|data:|blob:)/i.test(url);
  const normalizedSrc = isAbsoluteUrl(src) ? src : (src.startsWith('/') ? src : `/${src}`);
  const normalizedLowResSrc = lowResSrc 
    ? (isAbsoluteUrl(lowResSrc) ? lowResSrc : (lowResSrc.startsWith('/') ? lowResSrc : `/${lowResSrc}`))
    : undefined;

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

  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when image is 200px from viewport
    );

    const currentElement = document.getElementById(
      `img-${normalizedSrc.replace(/[^a-zA-Z0-9]/g, '-')}`
    );
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [normalizedSrc]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`${aspectRatioClasses[aspectRatio]} overflow-hidden relative ${className}`}
      id={`img-${normalizedSrc.replace(/[^a-zA-Z0-9]/g, '-')}`}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-md"
          aria-hidden="true"
        ></div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      )}

      <img
        src={isVisible ? normalizedSrc : normalizedLowResSrc || undefined}
        srcSet={isVisible ? srcSet : undefined}
        alt={alt}
        className={`w-full h-full ${objectFitClasses[objectFit]} ${
          onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B87351]' : ''
        } transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onClick={onClick ? e => onClick(e) : undefined}
        onKeyDown={onClick ? handleKeyDown : undefined}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes={sizes}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `View ${alt}` : undefined}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
