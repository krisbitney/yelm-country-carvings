import React, { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  title?: string;
  description?: string;
}

/**
 * A reusable modal component with enhanced accessibility features
 * including focus trapping, ARIA attributes, and keyboard navigation
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  showCloseButton = true,
  title,
  description,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Generate unique IDs for accessibility
  const modalId = useRef(`modal-${Math.random().toString(36).substr(2, 9)}`).current;
  const titleId = title ? `${modalId}-title` : undefined;
  const descriptionId = description ? `${modalId}-description` : undefined;

  // Handle ESC key to close modal and trap focus within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus within modal
      if (e.key === 'Tab') {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // If shift+tab and on first element, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // If tab and on last element, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Set focus to close button or first focusable element when modal opens
    const setInitialFocus = () => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    };

    // Store the element that had focus before the modal opened
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);

    // Set initial focus after a short delay to ensure the modal is rendered
    setTimeout(setInitialFocus, 50);

    return () => {
      // Remove event listeners
      window.removeEventListener('keydown', handleKeyDown);

      // Restore scrolling when modal is closed
      document.body.style.overflow = '';

      // Restore focus to the element that had focus before the modal opened
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, onClose, modalId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      id={modalId}
    >
      <div ref={modalRef} className={`relative ${className}`} onClick={e => e.stopPropagation()}>
        {title && (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        )}

        {description && (
          <p id={descriptionId} className="sr-only">
            {description}
          </p>
        )}

        {showCloseButton && (
          <button
            ref={closeButtonRef}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
