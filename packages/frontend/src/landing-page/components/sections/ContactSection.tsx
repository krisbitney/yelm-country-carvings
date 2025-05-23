import React, { useState } from 'react';
import { organizerEmail } from '../../../constants.ts';
import { FormInput, FormTextarea, FormSelect } from '../../../components/ui';
import {
  PlayIcon,
  ClockIcon,
  LocationIcon,
  PhoneIcon,
  EmailIcon,
} from '../../../components/ui/icons';

const ContactSection = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general', // Default subject
    message: '',
    files: [] as File[],
  });

  // State for form submission status
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  // --- Constants for calendar event ---
  const organizerName = 'Yelm Country Carvings';

  // --- Constants for the mailto link ---
  // More inviting subject line
  const visitSubject = "Let's Plan Your Visit to Yelm Country Carvings!";
  // Friendlier and more engaging body template
  const visitBodyTemplate = `Hi ${organizerName},\n\nI'd love to schedule a time to visit Yelm Country Carvings and see your wonderful chainsaw creations!\n\nCould you please suggest some potential dates and times that work for you?\n\nMy general availability is:\n[Please add your preferred dates/times here]\n\nLooking forward to meeting some happy carved friends!\n\nThanks,\n[Your Name]`;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  // Handle file upload with security validation for multiple files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const maxFiles = 3; // Maximum number of files allowed

      // Check if adding new files would exceed the maximum
      if (formData.files.length + newFiles.length > maxFiles) {
        setFormStatus({
          submitted: true,
          success: false,
          message: `You can upload a maximum of ${maxFiles} files.`,
        });
        // Reset the file input
        e.target.value = '';
        return;
      }

      // Validate each file
      for (const file of newFiles) {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          setFormStatus({
            submitted: true,
            success: false,
            message: 'Please upload only image files (JPEG, PNG, WEBP).',
          });
          // Reset the file input
          e.target.value = '';
          return;
        }

        // Validate file size
        if (file.size > maxSize) {
          setFormStatus({
            submitted: true,
            success: false,
            message: 'File size exceeds 5MB limit. Please upload smaller images.',
          });
          // Reset the file input
          e.target.value = '';
          return;
        }
      }

      // All files passed validation, update state
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));

      // Clear any previous error messages
      if (formStatus.submitted && !formStatus.success) {
        setFormStatus({
          submitted: false,
          success: false,
          message: '',
        });
      }
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function (optional field)
  const isValidPhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form (enhanced validation)
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields.',
      });
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid email address.',
      });
      return;
    }

    // Validate phone format if provided
    if (formData.phone && !isValidPhone(formData.phone)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid phone number.',
      });
      return;
    }

    try {
      // Set loading state
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Sending your message...',
      });

      // Create form data to send
      const emailFormData = new FormData();
      emailFormData.append('name', formData.name);
      emailFormData.append('email', formData.email);
      emailFormData.append('phone', formData.phone || 'Not provided');
      emailFormData.append('subject', formData.subject);
      emailFormData.append('message', formData.message);

      // Append files if they exist
      formData.files.forEach((file, index) => {
        emailFormData.append(`file${index}`, file);
      });

      // Send the form data to the server
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: emailFormData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message');
      }

      // Handle successful submission
      setFormStatus({
        submitted: true,
        success: true,
        message: result.message || "Thank you for your message! We'll get back to you soon.",
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
        files: [],
      });

      // Reset file input visually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error sending form:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'There was an error sending your message. Please try again later.',
      });
    }
  };

  return (
    <section id="contact" className="pt-16 pb-16 bg-[#F5F1E9]">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Carved Bear Icon */}
          <PlayIcon className="w-12 h-12 mx-auto mb-4 text-[#6B4F41]" />

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Contact Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Information (Left) */}
          <div className="bg-[#F5F1E9] p-6 rounded-lg shadow-md flex flex-col">
            {' '}
            {/* Added flex flex-col */}
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-6">
              Visit or Call Us
            </h3>
            <div className="space-y-4 grow">
              {' '}
              {/* Added grow */}
              {/* Hours */}
              <div className="flex items-start">
                <ClockIcon className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Hours</h4>
                  <p className="font-['Lato'] text-[#3E3C3B]">Monday - Friday: By Appointment</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Saturday: 10am - 4pm</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Sunday: 10am - 4pm</p>
                </div>
              </div>
              {/* Address */}
              <div className="flex items-start">
                <LocationIcon className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Address</h4>
                  <p className="font-['Lato'] text-[#3E3C3B]">19438 Cook Road Southeast</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Yelm, Washington 98597</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">United States</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start">
                <PhoneIcon className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Phone</h4>
                  <a
                    href="tel:+12532789814"
                    className="font-['Lato'] text-[#4A6151] hover:text-[#B87351] transition-colors duration-300"
                  >
                    (253) 278-9814
                  </a>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start">
                <EmailIcon className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Email</h4>
                  <a
                    href={`mailto:${organizerEmail}`}
                    className="font-['Lato'] text-[#4A6151] hover:text-[#B87351] transition-colors duration-300 break-all"
                  >
                    {organizerEmail}
                  </a>
                </div>
              </div>
            </div>
            {/* Schedule a Visit Button */}
            <div className="mt-8">
              <a
                href={`mailto:${organizerEmail}?subject=${encodeURIComponent(visitSubject)}&body=${encodeURIComponent(visitBodyTemplate)}`}
                className="inline-block px-6 py-3 bg-[#4A6151] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#6B4F41] transition-colors duration-300"
              >
                Schedule a Visit
              </a>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="bg-[#F5F1E9] p-6 rounded-lg shadow-md">
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-6">
              Send Us a Message
            </h3>

            {/* Form Submission Status */}
            {formStatus.submitted && (
              <div
                className={`p-4 mb-4 rounded-md ${
                  formStatus.success
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}
              >
                {formStatus.message}
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <FormInput
                label="Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              {/* Email Input */}
              <FormInput
                type="email"
                label="Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              {/* Phone Input (Optional) */}
              <FormInput
                type="tel"
                label="Phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(xxx) xxx-xxxx"
              />

              {/* Subject Select */}
              <FormSelect
                label="Subject"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'custom', label: 'Custom Order' },
                  { value: 'visit', label: 'Schedule a Visit' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'other', label: 'Other' },
                ]}
              />

              {/* Message Textarea */}
              <FormTextarea
                label="Message"
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required
              />

              {/* File Upload (Optional) */}
              <div>
                <label htmlFor="file-upload" className="block font-['Lato'] text-[#3E3C3B] mb-1">
                  Attach Images (Optional, max 3 files, 5MB each)
                </label>
                <input
                  type="file"
                  id="file-upload"
                  name="files"
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/webp" // Specify accepted types
                  multiple
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#A07E5D] file:text-[#F5F1E9] hover:file:bg-[#B87351] file:cursor-pointer"
                />

                {/* File List */}
                {formData.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">Attached files:</p>
                    <ul className="space-y-1">
                      {formData.files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Remove ${file.name}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>


              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md hover:bg-[#A07E5D] hover:cursor-pointer transition-colors duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
