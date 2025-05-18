import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the form validation schema
const galleryImageSchema = z.object({
  alt: z.string().min(1, 'Alt text is required'),
  src: z.string().min(1, 'Image is required'),
});

// Define the form data type
type GalleryFormData = z.infer<typeof galleryImageSchema>;

interface GalleryFormProps {
  onSubmit: (data: GalleryFormData) => Promise<void>;
  onCancel: () => void;
  uploadImage: (file: File) => Promise<string | null>;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ onSubmit, onCancel, uploadImage }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

  // Initialize the form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      alt: '',
      src: '',
    },
    mode: 'onChange', // Enable validation on change
  });

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      const imagePath = await uploadImage(file);

      if (imagePath) {
        setValue('src', imagePath);
        setImagePreview(imagePath);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadProgress(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: GalleryFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">
        Add New Gallery Image
      </h2>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-[#3E3C3B] font-['Lato'] mb-1">
          Gallery Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isSubmitting || uploadProgress}
          />
          <button
            type="button"
            onClick={() => document.getElementById('imageUpload')?.click()}
            className={`px-4 py-2 ${errors.src ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4A6151] hover:bg-[#3D5142]'} text-white font-['Lato'] rounded-md transition-colors duration-300 disabled:opacity-50`}
            disabled={isSubmitting || uploadProgress}
          >
            {uploadProgress ? 'Uploading...' : 'Upload Image'}
          </button>
          <input
            type="text"
            {...register('src')}
            className="hidden"
          />
          {errors.src && (
            <p className="mt-1 text-red-600 text-sm font-bold">{errors.src.message}</p>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-[#3E3C3B] font-['Lato'] mb-2">Image Preview:</p>
            <div className="w-full max-w-md h-48 bg-[#A07E5D]/20 relative overflow-hidden rounded-md">
              <img
                src={imagePreview.startsWith('/') ? imagePreview : `/${imagePreview}`}
                alt="Gallery preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Alt Text */}
      <div>
        <label htmlFor="alt" className="block text-[#3E3C3B] font-['Lato'] mb-1">
          Alt Text (Description)
        </label>
        <input
          id="alt"
          type="text"
          {...register('alt')}
          className={`w-full px-4 py-2 border ${errors.alt ? 'border-red-500' : 'border-[#A07E5D]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]`}
          disabled={isSubmitting}
          placeholder="Brief description of the image"
        />
        {errors.alt && (
          <p className="mt-1 text-red-600 text-sm font-bold">{errors.alt.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-[#A07E5D] text-[#A07E5D] font-['Lato'] font-bold rounded-md hover:bg-[#A07E5D] hover:text-white transition-colors duration-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !imagePreview}
          className="px-6 py-2 bg-[#4A6151] text-white font-['Lato'] font-bold rounded-md hover:bg-[#3D5142] transition-colors duration-300 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Add to Gallery'
          )}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;
