import React, {useState} from 'react';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { GalleryImage } from '../../types';

interface DraggableRowProps {
  image: GalleryImage;
  fetchGallery: () => void;
  deleteGalleryImage: (id: number) => Promise<boolean>;
}

export const DraggableRow: React.FC<DraggableRowProps & { provided: DraggableProvided; snapshot: DraggableStateSnapshot }> = ({
  provided, snapshot, image, fetchGallery, deleteGalleryImage
}) => {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  // Handle image deletion
  const handleDeleteImage = async (id: number) => {
    const success = await deleteGalleryImage(id);
    if (success) {
      setConfirmDelete(null);
      void fetchGallery();
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-[#F5F1E9] rounded-lg shadow-md transition-all duration-200 flex items-center p-3 ${
        snapshot.isDragging ? 'shadow-xl ring-2 ring-[#4A6151] scale-[1.02] z-10' : 'hover:shadow-lg'
      } cursor-grab`}
      style={{
        ...provided.draggableProps.style,
        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
      }}
    >
      <img
        src={image.src.startsWith('/') ? image.src : `/${image.src}`}
        alt={image.alt}
        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
      />

      <div className="ml-4 flex-grow">
        <p className="text-[#3E3C3B] font-['Lato'] font-medium">{image.alt}</p>
        <span className="text-xs text-[#6B4F41]">ID: {image.id}</span>
      </div>

      <button
        onClick={() => setConfirmDelete(image.id)}
        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 ml-4 flex-shrink-0"
        disabled={confirmDelete !== null}
      >
        Delete
      </button>

      {/* Delete Confirmation Overlay */}
      {confirmDelete === image.id && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-white rounded-lg">
          <p className="text-center mb-4">Are you sure you want to delete this image?</p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleDeleteImage?.(image.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-4 py-2 bg-[#4A6151] text-white rounded-md hover:bg-[#3D5142]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}