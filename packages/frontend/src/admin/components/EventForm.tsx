import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MarketEvent } from '../types';
import { format } from 'date-fns';

// Define the form validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  image: z.string().optional(),
});

// Define the form data type
type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: MarketEvent;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  uploadImage: (file: File) => Promise<string | null>;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel, uploadImage }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image || null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

  // Initialize the form with default values or existing event data
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          ...event,
        }
      : {
          title: '',
          date: '',
          location: '',
          description: '',
          startDate: format(new Date(), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
          image: '',
        },
  });

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      const imagePath = await uploadImage(file);
      
      if (imagePath) {
        setValue('image', imagePath);
        setImagePreview(imagePath);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadProgress(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate date string from start and end dates
  const generateDateString = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Format the dates
    const startMonth = start.toLocaleString('default', { month: 'long' });
    const endMonth = end.toLocaleString('default', { month: 'long' });
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    // If same year and month
    if (startYear === endYear && startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    }
    
    // If same year but different month
    if (startYear === endYear) {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
    }
    
    // Different years
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  };

  // Update the date string when start or end date changes
  const updateDateString = () => {
    const startDate = document.getElementById('startDate') as HTMLInputElement;
    const endDate = document.getElementById('endDate') as HTMLInputElement;
    
    if (startDate?.value && endDate?.value) {
      const dateString = generateDateString(startDate.value, endDate.value);
      setValue('date', dateString);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">
        {event ? 'Edit Event' : 'Add New Event'}
      </h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-[#3E3C3B] font-['Lato'] mb-1">
          Event Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-[#3E3C3B] font-['Lato'] mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            {...register('startDate')}
            className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
            disabled={isSubmitting}
            onChange={updateDateString}
          />
          {errors.startDate && (
            <p className="mt-1 text-red-600 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-[#3E3C3B] font-['Lato'] mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            {...register('endDate')}
            className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
            disabled={isSubmitting}
            onChange={updateDateString}
          />
          {errors.endDate && (
            <p className="mt-1 text-red-600 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Formatted Date String (hidden) */}
      <div className="hidden">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-[#3E3C3B] font-['Lato'] mb-1">
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register('location')}
          className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
          disabled={isSubmitting}
        />
        {errors.location && (
          <p className="mt-1 text-red-600 text-sm">{errors.location.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-[#3E3C3B] font-['Lato'] mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-red-600 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-[#3E3C3B] font-['Lato'] mb-1">
          Event Image
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
            className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300 disabled:opacity-50"
            disabled={isSubmitting || uploadProgress}
          >
            {uploadProgress ? 'Uploading...' : 'Upload Image'}
          </button>
          <input
            type="text"
            {...register('image')}
            className="hidden"
          />
          {errors.image && (
            <p className="mt-1 text-red-600 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-[#3E3C3B] font-['Lato'] mb-2">Image Preview:</p>
            <div className="w-full max-w-md h-48 bg-[#A07E5D]/20 relative overflow-hidden rounded-md">
              <img
                src={imagePreview}
                alt="Event preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
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
          disabled={isSubmitting}
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
            'Save Event'
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;