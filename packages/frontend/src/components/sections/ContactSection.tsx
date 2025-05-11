import React, { useState } from 'react';

interface ContactSectionProps {
  // Add any props if needed
}

const ContactSection: React.FC<ContactSectionProps> = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    file: null as File | null,
  });

  // State for form submission status
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  // --- Constants for calendar event ---
  const organizerName = "Yelm Country Carvings";
  const organizerEmail = 'tlzumach@hotmail.com';

  // --- Constants for the mailto link ---
  // More inviting subject line
  const visitSubject = "Let's Plan Your Visit to Yelm Country Carvings!";
  // Friendlier and more engaging body template
  const visitBodyTemplate = `Hi ${organizerName},\n\nI'd love to schedule a time to visit Yelm Country Carvings and see your wonderful chainsaw creations!\n\nCould you please suggest some potential dates and times that work for you?\n\nMy general availability is:\n[Please add your preferred dates/times here]\n\nLooking forward to meeting some happy carved friends!\n\nThanks,\n[Your Name]`;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload with security validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setFormStatus({
          submitted: true,
          success: false,
          message: 'Please upload only image files (JPEG, PNG, WEBP).'
        });
        // Reset the file input
        e.target.value = '';
        return;
      }

      // Validate file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setFormStatus({
          submitted: true,
          success: false,
          message: 'File size exceeds 5MB limit. Please upload a smaller image.'
        });
        // Reset the file input
        e.target.value = '';
        return;
      }

      // File passed validation, update state
      setFormData(prev => ({
        ...prev,
        file: file
      }));

      // Clear any previous error messages
      if (formStatus.submitted && !formStatus.success) {
        setFormStatus({
          submitted: false,
          success: false,
          message: ''
        });
      }
    }
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
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields.'
      });
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid email address.'
      });
      return;
    }

    // Validate phone format if provided
    if (formData.phone && !isValidPhone(formData.phone)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid phone number.'
      });
      return;
    }

    try {
      // Set loading state
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Sending your message...'
      });

      // Create form data to send
      const emailFormData = new FormData();
      emailFormData.append('name', formData.name);
      emailFormData.append('email', formData.email);
      emailFormData.append('phone', formData.phone || 'Not provided');
      emailFormData.append('message', formData.message);

      // Append file if exists
      if (formData.file) {
        emailFormData.append('file', formData.file);
      }

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
        message: result.message || 'Thank you for your message! We\'ll get back to you soon.'
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        file: null,
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
        message: error instanceof Error ? error.message : 'There was an error sending your message. Please try again later.'
      });
    }
  };

  return (
    <section id="contact" className="pt-16 pb-16 bg-[#F5F1E9]">

      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Carved Bear Icon */}
          <svg
            className="w-12 h-12 mx-auto mb-4 text-[#6B4F41]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Placeholder Icon - Replace if you have a specific bear icon SVG */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM9.5 16.5l7-4.5-7-4.5v9z"/> {/* Example bear paw or similar */}
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Contact Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Information (Left) */}
          <div className="bg-[#F5F1E9] p-6 rounded-lg shadow-md flex flex-col"> {/* Added flex flex-col */}
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-6">Visit or Call Us</h3>

            <div className="space-y-4 grow"> {/* Added grow */}
              {/* Hours */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Hours</h4>
                  <p className="font-['Lato'] text-[#3E3C3B]">Monday - Friday: By Appointment</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Saturday: 10am - 4pm</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Sunday: 10am - 4pm</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Address</h4>
                  <p className="font-['Lato'] text-[#3E3C3B]">19438 Cook Road Southeast</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Yelm, Washington 98597</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">United States</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Phone</h4>
                  <a href="tel:+12532789814" className="font-['Lato'] text-[#4A6151] hover:text-[#B87351] transition-colors duration-300">(253) 278-9814</a>
                </div>
              </div>

               {/* Email */}
             <div className="flex items-start">
               <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
               <div>
                 <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Email</h4>
                 <a href={`mailto:${organizerEmail}`} className="font-['Lato'] text-[#4A6151] hover:text-[#B87351] transition-colors duration-300 break-all">{organizerEmail}</a>
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
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-6">Send Us a Message</h3>

            {/* Form Submission Status */}
            {formStatus.submitted && (
              <div className={`p-4 mb-4 rounded-md ${
                formStatus.success
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {formStatus.message}
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block font-['Lato'] text-[#3E3C3B] mb-1">Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block font-['Lato'] text-[#3E3C3B] mb-1">Email <span className="text-red-600">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  required
                />
              </div>

              {/* Phone Input (Optional) */}
              <div>
                <label htmlFor="phone" className="block font-['Lato'] text-[#3E3C3B] mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  placeholder="(xxx) xxx-xxxx"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block font-['Lato'] text-[#3E3C3B] mb-1">Message <span className="text-red-600">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  required
                ></textarea>
              </div>

              {/* File Upload (Optional) */}
              <div>
                <label htmlFor="file-upload" className="block font-['Lato'] text-[#3E3C3B] mb-1">Attach an Image (Optional, max 5MB)</label>
                <input
                  type="file"
                  id="file-upload"
                  name="file"
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/webp" // Specify accepted types
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#A07E5D] file:text-[#F5F1E9] hover:file:bg-[#B87351] file:cursor-pointer"
                />
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
