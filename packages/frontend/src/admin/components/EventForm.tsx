import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MarketEvent } from '../../types.ts';
import { format } from 'date-fns';
import { generateDateString } from "../../utils/generateDateString.ts";
import ImageUpload from './ImageUpload';

// Define the form validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  image: z.string().min(1, 'Image is required'),
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

  // Initialize the form with default values or existing event data
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
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

  // Watch the start and end date fields
  const startDate = watch('startDate');
  const endDate = watch('endDate');


  // Handle form submission
  const handleFormSubmit = useCallback(async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, setIsSubmitting]);

  // Update the date string when start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      const dateString = generateDateString(startDate, endDate);
      setValue('date', dateString);
    }
  }, [startDate, endDate, setValue]);

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
        <ImageUpload
          initialImage={event?.image}
          onImageUpload={uploadImage}
          onImageChange={(imagePath) => setValue('image', imagePath)}
          error={errors.image?.message}
        />
        <input
          type="text"
          {...register('image')}
          className="hidden"
        />
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
