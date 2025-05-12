import React, { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from '@hello-pangea/dnd';

/**
 * A wrapper component for @hello-pangea/dnd's Droppable that makes it work better with React StrictMode.
 * This is needed because drag-and-drop libraries can have issues with the double rendering that StrictMode causes.
 */
export const StrictModeDroppable: React.FC<DroppableProps> = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    // Ensures the Droppable renders after the initial StrictMode double-render cycle.
    if (typeof window !== 'undefined') { // Ensure this runs only on the client-side
        animationFrameId = requestAnimationFrame(() => setEnabled(true));
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Optionally, you might want to reset enabled to false if the component can unmount and remount frequently,
      // though for many dnd setups this isn't strictly necessary once initially enabled.
      // setEnabled(false); 
    };
  }, []); // Empty dependency array ensures this runs once on mount

  if (!enabled) {
    // You can return null or a placeholder/loader here if needed
    // to prevent the Droppable from rendering prematurely.
    return null;
  }

  return (
    <Droppable {...props}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
};
