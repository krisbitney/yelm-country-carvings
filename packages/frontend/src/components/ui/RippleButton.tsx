import React, { useState, useEffect } from 'react';

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * A button component with a ripple effect on click
 */
const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel,
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Clean up ripples after animation
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    ripples.forEach(ripple => {
      const timeoutId = setTimeout(() => {
        setRipples(prevRipples => prevRipples.filter(r => r.id !== ripple.id));
      }, 800); // Match the animation duration

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [ripples]);

  // Handle click and create ripple
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Calculate ripple position relative to button
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new ripple
    setRipples([...ripples, { x, y, id: Date.now() }]);

    // Call original onClick handler
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {/* Ripple elements */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white bg-opacity-30 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            paddingBottom: '200%',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default RippleButton;
