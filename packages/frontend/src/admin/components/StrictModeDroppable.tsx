import React, { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from '@hello-pangea/dnd';

/**
 * A wrapper component for @hello-pangea/dnd's Droppable that makes it work better with React StrictMode.
 * This is needed because drag-and-drop libraries can have issues with the double rendering that StrictMode causes.
 */
export const StrictModeDroppable: React.FC<DroppableProps> = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animationFrameId: number = requestAnimationFrame(() => setEnabled(true));

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{(provided, snapshot) => children(provided, snapshot)}</Droppable>;
};
