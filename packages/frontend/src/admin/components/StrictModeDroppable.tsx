import { useMemo } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

/**
 * A wrapper component for react-beautiful-dnd's Droppable that makes it work with React StrictMode
 * This is needed because react-beautiful-dnd doesn't handle the double rendering that StrictMode causes
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  // Use useMemo to ensure the droppableId doesn't change on re-renders
  const droppableId = useMemo(() => props.droppableId, [props.droppableId]);
  
  // Return the Droppable with a memoized droppableId
  return (
    <Droppable {...props} droppableId={droppableId}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
};