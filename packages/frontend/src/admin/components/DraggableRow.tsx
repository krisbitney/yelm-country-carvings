import React, { useState } from 'react';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { GalleryImage } from '../../types';
import { Modal } from '../../components/ui';

interface DraggableRowProps {
  image: GalleryImage;
  fetchGallery: () => void;
  deleteGalleryImage: (id: number) => Promise<boolean>;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
}

export const DraggableRow: React.FC<
  DraggableRowProps & { provided: DraggableProvided; snapshot: DraggableStateSnapshot }
> = ({
  provided,
  snapshot,
  image,
  fetchGallery,
  deleteGalleryImage,
  isSelected = false,
  onSelect,
}) => {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
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
      className={`bg-[#F5F1E9] rounded-lg shadow-md transition-all duration-300 flex items-center p-4 ${
        snapshot.isDragging
          ? 'shadow-xl ring-2 ring-[#4A6151] scale-[1.02] z-10 bg-[#F5F1E9]/95'
          : 'hover:shadow-lg hover:bg-[#F5F1E9]/90'
      } ${isSelected ? 'ring-2 ring-[#B87351]' : ''} cursor-grab`}
      style={{
        ...provided.draggableProps.style,
        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div
          className="mr-3 flex-shrink-0"
          onClick={e => {
            e.stopPropagation();
            onSelect(image.id, !isSelected);
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="w-5 h-5 rounded border-[#4A6151] text-[#4A6151] focus:ring-[#4A6151] cursor-pointer"
            aria-label={`Select image ${image.alt || ''}`}
          />
        </div>
      )}

      <img
        src={image.src.startsWith('/') ? image.src : `/${image.src}`}
        alt={image.alt}
        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
        loading="lazy"
      />

      <div className="ml-4 flex-grow">
        <p className="text-[#3E3C3B] font-['Lato'] font-medium">{image.alt}</p>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#6B4F41]">ID: {image.id}</span>
        </div>
      </div>

      <div className="flex space-x-2 ml-4 flex-shrink-0">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="text-[#4A6151] hover:text-[#3D5142] text-sm px-3 py-1 transition-all duration-300 cursor-pointer hover:bg-[#4A6151]/10 rounded-md"
        >
          Preview
        </button>
        <button
          onClick={() => setConfirmDelete(image.id)}
          className="text-red-600 hover:text-red-800 text-sm px-3 py-1 transition-all duration-300 cursor-pointer hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={confirmDelete !== null}
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Overlay */}
      {confirmDelete === image.id && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-white rounded-lg transition-all duration-300 backdrop-blur-sm">
          <p className="text-center mb-4 font-['Lato']">
            Are you sure you want to delete this image?
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleDeleteImage?.(image.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 cursor-pointer hover:shadow transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-4 py-2 bg-[#4A6151] text-white rounded-md hover:bg-[#3D5142] transition-all duration-300 cursor-pointer hover:shadow transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        className="max-w-4xl max-h-[90vh]"
      >
        <div className="p-4">
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Image Preview</h3>
          <div className="bg-[#F5F1E9] p-2 rounded-lg shadow-md">
            <img
              src={image.src.startsWith('/') ? image.src : `/${image.src}`}
              alt={image.alt || 'Gallery image'}
              className="max-w-full max-h-[70vh] object-contain rounded-md mx-auto"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-[#3E3C3B] font-['Lato'] font-medium">{image.alt}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
