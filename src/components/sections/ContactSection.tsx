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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form (basic validation)
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields.'
      });
      return;
    }

    // In a real implementation, this would send the form data to a server
    console.log('Form submitted:', formData);

    // Simulate successful submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      file: null,
    });
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Contact Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Information (Left) */}
          <div className="bg-[#F5F1E9] p-6 rounded-lg shadow-md">
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-6">Visit or Call Us</h3>

            <div className="space-y-4">
              {/* Hours */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Hours</h4>
                  <p className="font-['Lato'] text-[#3E3C3B]">Monday - Friday: 9am - 5pm</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Saturday: 10am - 4pm</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Sunday: Closed</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Address</h4>
                  <p className="font-['Lato'] text-[#3E3C3B]">123 Carving Lane</p>
                  <p className="font-['Lato'] text-[#3E3C3B]">Yelm, WA 98597</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Phone</h4>
                  <a href="tel:+15551234567" className="font-['Lato'] text-[#4A6151] hover:text-[#B87351] transition-colors duration-300">(555) 123-4567</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#6B4F41] mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="font-['Lato'] font-bold text-[#3E3C3B]">Email</h4>
                  <a href="mailto:info@yelmcountrycarvings.com" className="font-['Lato'] text-[#4A6151] hover:text-[#B87351] transition-colors duration-300">info@yelmcountrycarvings.com</a>
                </div>
              </div>
            </div>

            {/* Schedule a Visit Button */}
            <div className="mt-8">
              <a 
                href="#" 
                className="inline-block px-6 py-3 bg-[#4A6151] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#6B4F41] transition-colors duration-300"
              >
                Schedule a Visit
              </a>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="bg-[#F5F1E9] p-6 rounded-lg shadow-md">
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-6">Get a Free Quote!</h3>

            {formStatus.submitted && (
              <div className={`p-4 mb-6 rounded-md ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block font-['Lato'] font-bold text-[#3E3C3B] mb-2">Name *</label>
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

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block font-['Lato'] font-bold text-[#3E3C3B] mb-2">Email *</label>
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

              {/* Phone Field */}
              <div className="mb-4">
                <label htmlFor="phone" className="block font-['Lato'] font-bold text-[#3E3C3B] mb-2">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                />
              </div>

              {/* Message Field */}
              <div className="mb-4">
                <label htmlFor="message" className="block font-['Lato'] font-bold text-[#3E3C3B] mb-2">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  required
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label htmlFor="file" className="block font-['Lato'] font-bold text-[#3E3C3B] mb-2">Upload Inspiration Image</label>
                <input 
                  type="file" 
                  id="file" 
                  name="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  accept="image/*"
                />
                <p className="text-sm text-[#3E3C3B] mt-1">Optional: Share an image to help us understand your vision.</p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full px-6 py-3 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#A07E5D] transition-colors duration-300"
              >
                Send Message
              </button>

              {/* Privacy Note */}
              <p className="text-sm text-[#3E3C3B] mt-4 text-center">Your information is kept confidential.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
