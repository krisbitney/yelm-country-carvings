import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import AdminLayout from '../components/AdminLayout';
import GalleryForm from '../components/GalleryForm';
import { useAdminGallery } from '../hooks/useAdminGallery';
import { GalleryImage } from '../types';

const GalleryPage: React.FC = () => {
  const { gallery, loading, error, fetchGallery, addGalleryImage, deleteGalleryImage, reorderGallery, uploadGalleryImage } = useAdminGallery();
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch gallery on component mount
  useEffect(() => {
    void fetchGallery();
  }, [fetchGallery]);

  // Handle error from useAdminGallery
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle image addition
  const handleAddImage = async (imageData: Omit<GalleryImage, 'id'>) => {
    const success = await addGalleryImage(imageData);
    if (success) {
      setIsAddingImage(false);
      void fetchGallery();
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (id: number) => {
    const success = await deleteGalleryImage(id);
    if (success) {
      setConfirmDelete(null);
      void fetchGallery();
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setIsAddingImage(false);
  };

  // Handle drag end for reordering
  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    
    // If dropped outside the list or no movement
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }
    
    // Create a copy of the gallery
    const newGallery = Array.from(gallery);
    
    // Remove the dragged item
    const [removed] = newGallery.splice(result.source.index, 1);
    
    // Insert it at the new position
    newGallery.splice(result.destination.index, 0, removed);
    
    // Get the ordered IDs
    const imageIds = newGallery.map(img => img.id);
    
    // Update the order in the backend
    const success = await reorderGallery(imageIds);
    
    if (!success) {
      // If reordering failed, fetch the original order
      void fetchGallery();
    }
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-['Cinzel'] text-3xl font-bold text-[#6B4F41]">Gallery Management</h2>
        <button
          onClick={() => setIsAddingImage(true)}
          className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300"
          disabled={isAddingImage}
        >
          Add New Image
        </button>
      </div>

      {/* Loading State */}
      {loading && !isAddingImage && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-[#4A6151] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#3E3C3B] font-['Lato']">Loading gallery...</p>
        </div>
      )}

      {/* Add Image Form */}
      {isAddingImage && (
        <div className="mb-8">
          <GalleryForm
            onSubmit={handleAddImage}
            onCancel={handleCancelForm}
            uploadImage={uploadGalleryImage}
          />
        </div>
      )}

      {/* Gallery Grid with Drag and Drop */}
      {!loading && !isAddingImage && (
        <>
          {gallery.length === 0 ? (
            <div className="text-center py-8 bg-[#F5F1E9] rounded-lg">
              <p className="text-[#3E3C3B] font-['Lato'] mb-4">No gallery images found. Add your first image to get started.</p>
              <button
                onClick={() => setIsAddingImage(true)}
                className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300"
              >
                Add New Image
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <p className="text-[#3E3C3B] font-['Lato']">
                  <span className="font-bold">Tip:</span> Drag and drop images to reorder them. The order here will be reflected on the public gallery.
                </p>
              </div>
              
              <DragDropContext 
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
              >
                <Droppable droppableId="gallery" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {gallery.map((image, index) => (
                        <Draggable key={image.id.toString()} draggableId={image.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[#F5F1E9] rounded-lg overflow-hidden shadow-md ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-[#4A6151]' : ''
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                cursor: isDragging ? 'grabbing' : 'grab',
                              }}
                            >
                              <div className="aspect-w-4 aspect-h-3 relative">
                                <img
                                  src={image.src}
                                  alt={image.alt}
                                  className="w-full h-48 object-cover"
                                />
                                
                                {/* Delete Confirmation Overlay */}
                                {confirmDelete === image.id && (
                                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-white">
                                    <p className="text-center mb-4">Are you sure you want to delete this image?</p>
                                    <div className="flex space-x-4">
                                      <button
                                        onClick={() => handleDeleteImage(image.id)}
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
                              
                              <div className="p-3">
                                <p className="text-[#3E3C3B] font-['Lato'] text-sm truncate">{image.alt}</p>
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-xs text-[#6B4F41]">ID: {image.id}</span>
                                  <button
                                    onClick={() => setConfirmDelete(image.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                    disabled={confirmDelete !== null}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default GalleryPage;