import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DragDropContext, Draggable, DropResult } from '@hello-pangea/dnd';
import AdminLayout from '../components/AdminLayout';
import GalleryForm from '../components/GalleryForm';
import { useAdminGallery } from '../hooks/useAdminGallery';
import { GalleryImage } from '../../types.ts';
import { StrictModeDroppable } from '../components/StrictModeDroppable';
import { DraggableRow } from '../components/DraggableRow.tsx';

const GalleryPage: React.FC = () => {
  const {
    gallery,
    loading,
    error,
    fetchGallery,
    addGalleryImage,
    deleteGalleryImage,
    reorderGallery,
    uploadGalleryImage,
  } = useAdminGallery();
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

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

  // Cancel form
  const handleCancelForm = () => {
    setIsAddingImage(false);
  };

  // Handle drag end for reordering
  const handleDragEnd = async (result: DropResult) => {
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
    // Note: reorderGallery already updates the gallery state internally
    const success = await reorderGallery(imageIds);

    if (!success) {
      toast.error('Failed to reorder images.');
    }
  };

  // Handle image selection
  const handleImageSelection = (id: number, selected: boolean) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };


  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;

    let successCount = 0;
    let failCount = 0;

    // Show loading toast
    const loadingToastId = toast.loading(`Deleting ${selectedImages.size} images...`);

    // Delete each selected image
    for (const id of selectedImages) {
      const success = await deleteGalleryImage(id);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Update toast with result
    toast.update(loadingToastId, {
      render: `Deleted ${successCount} images${failCount > 0 ? `, failed to delete ${failCount} images` : ''}`,
      type: failCount > 0 ? 'warning' : 'success',
      isLoading: false,
      autoClose: 3000,
    });

    // Clear selection and close confirmation
    setSelectedImages(new Set());
    setIsBulkDeleteConfirmOpen(false);

    // Refresh gallery
    void fetchGallery();
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-['Cinzel'] text-3xl font-bold text-[#6B4F41]">Gallery Management</h2>
        <button
          onClick={() => setIsAddingImage(true)}
          className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-all duration-300 cursor-pointer hover:shadow transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-[#3E3C3B] font-['Lato'] mb-4">
                No gallery images found. Add your first image to get started.
              </p>
              <button
                onClick={() => setIsAddingImage(true)}
                className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-all duration-300 cursor-pointer hover:shadow transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Add New Image
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              {/* Bulk Operations */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <span className="text-[#3E3C3B] font-['Lato']">
                    {selectedImages.size} of {gallery.length} selected
                  </span>
                </div>

                {selectedImages.size > 0 && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsBulkDeleteConfirmOpen(true)}
                      className="px-4 py-2 bg-red-500 text-white font-['Lato'] rounded-md hover:bg-red-600 transition-all duration-300"
                    >
                      Delete Selected ({selectedImages.size})
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Delete Confirmation Modal */}
              {isBulkDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">
                      Confirm Bulk Delete
                    </h3>
                    <p className="text-[#3E3C3B] font-['Lato'] mb-6">
                      Are you sure you want to delete {selectedImages.size} selected images? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setIsBulkDeleteConfirmOpen(false)}
                        className="px-4 py-2 border border-[#A07E5D] text-[#A07E5D] font-['Lato'] rounded-md hover:bg-[#A07E5D]/10 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-500 text-white font-['Lato'] rounded-md hover:bg-red-600 transition-all duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 bg-[#4A6151]/10 p-5 rounded-lg border border-[#4A6151]/20 transition-all duration-300 hover:bg-[#4A6151]/15">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#4A6151] mr-3 flex-shrink-0 mt-0.5 transition-transform duration-300 hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-[#3E3C3B] font-['Lato'] font-bold mb-2 transition-all duration-300">
                      Gallery Management
                    </p>
                    <p className="text-[#3E3C3B] font-['Lato'] transition-all duration-300">
                      To rearrange images in this list, click and hold anywhere on an image row,
                      then move it up or down to a new position. Release to drop it in place.
                      <br />
                      The order you set here will be reflected on the public gallery page of your
                      website.
                      <br />
                      You can also select multiple images using the checkboxes for bulk operations.
                    </p>
                  </div>
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <StrictModeDroppable droppableId="gallery" type="list">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex flex-col gap-4 transition-all duration-300 ${
                        snapshot.isDraggingOver
                          ? 'bg-[#4A6151]/10 rounded-lg p-4 shadow-inner'
                          : 'p-1'
                      }`}
                    >
                      {gallery.map((image, index) => (
                        <Draggable key={image.id} draggableId={image.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <DraggableRow
                              provided={provided}
                              snapshot={snapshot}
                              image={image}
                              fetchGallery={fetchGallery}
                              deleteGalleryImage={deleteGalleryImage}
                              isSelected={selectedImages.has(image.id)}
                              onSelect={handleImageSelection}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </DragDropContext>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default GalleryPage;
