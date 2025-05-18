import React, { useState, useCallback } from 'react';

interface ImageUploadProps {
  initialImage?: string;
  onImageUpload: (file: File) => Promise<string | null>;
  onImageChange: (imagePath: string) => void;
  error?: string;
  label?: string;
}

/**
 * ImageUpload component for handling image uploads
 */
const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage,
  onImageUpload,
  onImageChange,
  error,
  label = 'Image'
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

  // Handle image upload
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      const imagePath = await onImageUpload(file);

      if (imagePath) {
        setImagePreview(imagePath);
        onImageChange(imagePath);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadProgress(false);
    }
  }, [onImageUpload, onImageChange]);

  return (
    <div>
      <label htmlFor="image" className="block text-[#3E3C3B] font-['Lato'] mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploadProgress}
        />
        <button
          type="button"
          onClick={() => document.getElementById('imageUpload')?.click()}
          className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300 disabled:opacity-50"
          disabled={uploadProgress}
        >
          {uploadProgress ? 'Uploading...' : 'Upload Image'}
        </button>
        {error && (
          <p className="mt-1 text-red-600 text-sm">{error}</p>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4">
          <p className="text-[#3E3C3B] font-['Lato'] mb-2">Image Preview:</p>
          <div className="w-full max-w-md h-48 bg-[#A07E5D]/20 relative overflow-hidden rounded-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
