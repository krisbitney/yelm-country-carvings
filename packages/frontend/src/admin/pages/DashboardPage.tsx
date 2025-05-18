import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const DashboardPage: React.FC = () => {
  // Admin name from environment variable or default to "Admin"
  const adminName = import.meta.env.VITE_ADMIN_NAME || "Admin";

  // Collection of inspirational quotes
  const inspirationalQuotes = [
    "Creativity is intelligence having fun. - Albert Einstein",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. - Steve Jobs",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer"
  ];

  // State for the current inspirational quote
  const [quote, setQuote] = useState<string>("");

  // Set a random inspirational quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setQuote(inspirationalQuotes[randomIndex]);
  }, []);

  return (
    <AdminLayout title="Admin Portal">
      <div className="mb-8">
        <h2 className="font-['Cinzel'] text-3xl font-bold text-[#6B4F41] mb-4">Welcome, {adminName}!</h2>
        <p className="text-[#3E3C3B] font-['Lato']">
          Use this dashboard to manage your website content. Select a section below to get started.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-[#4A6151] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41]">Events Management</h3>
            </div>
            <p className="text-[#3E3C3B] font-['Lato'] mb-6">
              Add, edit, or remove upcoming events. Keep your customers informed about where they can find you.
            </p>
            <Link
              to="events"
              className="inline-block px-6 py-3 bg-[#4A6151] text-white font-['Lato'] font-bold rounded-md hover:bg-[#3D5142] transition-colors duration-300"
            >
              Manage Events
            </Link>
          </div>
        </div>

        {/* Gallery Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-[#4A6151] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41]">Gallery Management</h3>
            </div>
            <p className="text-[#3E3C3B] font-['Lato'] mb-6">
              Upload, arrange, or remove images from your gallery. Showcase your best work to potential customers.
            </p>
            <Link
              to="gallery"
              className="inline-block px-6 py-3 bg-[#4A6151] text-white font-['Lato'] font-bold rounded-md hover:bg-[#3D5142] transition-colors duration-300"
            >
              Manage Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Inspirational Message Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Daily Inspiration</h3>
        <p className="text-[#3E3C3B] font-['Lato'] mb-4 italic">
          "{quote}"
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#A07E5D] text-white font-['Lato'] font-bold rounded-md hover:bg-[#B87351] transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Website
          </a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
