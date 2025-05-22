import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MarketEvent } from '../../types.ts';
import { format, parse } from 'date-fns';
import ImageUpload from './ImageUpload';
import { formatDateRange } from '../../utils/dateUtils.ts';

// Define the form validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  image: z.string().min(1, 'Image is required'),
}).refine((data) => {
  // Skip validation if dates are not properly formatted
  if (!data.startDate || !data.endDate || 
      data.startDate === '__/__/____' || 
      data.endDate === '__/__/____' ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(data.startDate) ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(data.endDate)) {
    return true;
  }

  try {
    const startDate = parse(data.startDate, 'MM/dd/yyyy', new Date());
    const endDate = parse(data.endDate, 'MM/dd/yyyy', new Date());
    return startDate <= endDate;
  } catch (error) {
    return false;
  }
}, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"] // Show error on the end date field
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

  // Function to format date from yyyy-MM-dd to MM/DD/YYYY
  const formatDateForInput = (dateStr: string): string => {
    try {
      if (!dateStr) return '';
      // Check if the date is already in MM/DD/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        return dateStr;
      }
      // Parse the date and format it to MM/DD/YYYY
      const date = new Date(dateStr);
      return format(date, 'MM/dd/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

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
          // Format dates to MM/DD/YYYY
          startDate: formatDateForInput(event.startDate),
          endDate: formatDateForInput(event.endDate),
        }
      : {
          title: '',
          location: '',
          description: '',
          startDate: format(new Date(), 'MM/dd/yyyy'),
          endDate: format(new Date(), 'MM/dd/yyyy'),
          image: '',
        },
    mode: 'onChange', // Enable validation on change
  });

  // Watch the start and end date fields
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Log form values for debugging
  useEffect(() => {
    if (event) {
      console.log('Event prop:', event);
      console.log('Form values - startDate:', startDate, 'endDate:', endDate);
    }
  }, [event, startDate, endDate]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: EventFormData) => {
      try {
        setIsSubmitting(true);

        // Validate date formats
        if (data.startDate === '__/__/____' || data.endDate === '__/__/____') {
          console.error('Invalid date format');
          return;
        }

        // Convert MM/DD/YYYY to ISO format for backend
        try {
          const startDateObj = parse(data.startDate, 'MM/dd/yyyy', new Date());
          const endDateObj = parse(data.endDate, 'MM/dd/yyyy', new Date());

          // Additional validation to ensure start date is before or equal to end date
          if (startDateObj > endDateObj) {
            console.error('Start date must be before or equal to end date');
            return;
          }

          // Format dates to ISO string for backend
          const formattedData = {
            ...data,
            startDate: format(startDateObj, 'yyyy-MM-dd'),
            endDate: format(endDateObj, 'yyyy-MM-dd')
          };

          await onSubmit(formattedData);
        } catch (error) {
          console.error('Error parsing dates for submission:', error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, setIsSubmitting]
  );

  // Function to handle date input with mask
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const { value } = e.target;

    // Remove all non-digits
    let digits = value.replace(/\D/g, '');

    // Validate month (1-12)
    if (digits.length >= 2) {
      const month = parseInt(digits.substring(0, 2), 10);
      if (month > 12) {
        digits = '12' + digits.substring(2);
      } else if (month === 0) {
        digits = '01' + digits.substring(2);
      }
    }

    // Validate day (1-31)
    if (digits.length >= 4) {
      const day = parseInt(digits.substring(2, 4), 10);
      if (day > 31) {
        digits = digits.substring(0, 2) + '31' + digits.substring(4);
      } else if (day === 0) {
        digits = digits.substring(0, 2) + '01' + digits.substring(4);
      }
    }

    // Limit to 8 digits (MMDDYYYY)
    digits = digits.substring(0, 8);

    let formattedValue = '';

    // Format with slashes
    if (digits.length > 0) {
      // Add first slash after MM
      formattedValue = digits.substring(0, 2);
      if (digits.length > 2) {
        formattedValue += '/' + digits.substring(2, 4);
      }
      // Add second slash after DD
      if (digits.length > 4) {
        formattedValue += '/' + digits.substring(4, 8);
      }
    }

    // If the input is empty, show the placeholder with slashes
    if (formattedValue === '') {
      formattedValue = '__/__/____';
    }

    // Update the field value
    field.onChange(formattedValue);
  };

  // Update the date string when start or end date changes
  useEffect(() => {
    if (startDate && endDate && startDate !== '__/__/____' && endDate !== '__/__/____') {
      try {
        // Parse the MM/DD/YYYY format to Date objects
        const startDateObj = parse(startDate, 'MM/dd/yyyy', new Date());
        const endDateObj = parse(endDate, 'MM/dd/yyyy', new Date());

        // Format the date range
        const dateString = formatDateRange(startDateObj, endDateObj);
        setValue('date', dateString);
      } catch (error) {
        console.error('Error parsing dates:', error);
      }
    }
  }, [startDate, endDate, setValue]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
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
          className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-[#A07E5D]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-[#3E3C3B]`}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-red-600 text-sm font-bold">{errors.title.message}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-[#3E3C3B] font-['Lato'] mb-1">
            Start Date (MM/DD/YYYY)
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <input
                id="startDate"
                type="text"
                placeholder="__/__/____"
                value={field.value || '__/__/____'}
                onChange={(e) => handleDateInput(e, field)}
                className={`w-full px-4 py-2 border ${errors.startDate ? 'border-red-500' : 'border-[#A07E5D]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-[#3E3C3B]`}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.startDate && (
            <p className="mt-1 text-red-600 text-sm font-bold">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-[#3E3C3B] font-['Lato'] mb-1">
            End Date (MM/DD/YYYY)
          </label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <input
                id="endDate"
                type="text"
                placeholder="__/__/____"
                value={field.value || '__/__/____'}
                onChange={(e) => handleDateInput(e, field)}
                className={`w-full px-4 py-2 border ${errors.endDate ? 'border-red-500' : 'border-[#A07E5D]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-[#3E3C3B]`}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.endDate && (
            <p className="mt-1 text-red-600 text-sm font-bold">{errors.endDate.message}</p>
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
          className={`w-full px-4 py-2 border ${errors.location ? 'border-red-500' : 'border-[#A07E5D]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-[#3E3C3B]`}
          disabled={isSubmitting}
        />
        {errors.location && (
          <p className="mt-1 text-red-600 text-sm font-bold">{errors.location.message}</p>
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
          className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-[#A07E5D]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-[#3E3C3B]`}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-red-600 text-sm font-bold">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <ImageUpload
          initialImage={event?.image}
          onImageUpload={uploadImage}
          onImageChange={imagePath => setValue('image', imagePath)}
          error={errors.image?.message}
        />
        <input type="text" {...register('image')} className="hidden" />
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
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
