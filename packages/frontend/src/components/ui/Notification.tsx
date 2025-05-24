import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

/**
 * A subtle notification component for displaying feedback messages
 */
const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  show,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Control visibility based on the show prop
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Auto-hide after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onClose) onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose]);
  
  // Handle animation end
  const handleAnimationEnd = () => {
    if (!isVisible && onClose) {
      onClose();
    }
  };
  
  // Determine styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };
  
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md border rounded-md shadow-md transition-all duration-500 ${getTypeStyles()} ${
        isVisible 
          ? 'opacity-100 translate-y-0 animate-slideInUp' 
          : 'opacity-0 translate-y-4'
      }`}
      role="alert"
      aria-live="assertive"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">{message}</div>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1 transition-colors duration-300"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;