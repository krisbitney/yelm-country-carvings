import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { adminName, inspirationalQuotes } from '../../constants.ts';
import DashboardCard from '../components/ui/DashboardCard';

const DashboardPage: React.FC = () => {
  // State for the current inspirational quote
  const [quote, setQuote] = useState<string>('');

  // Set a random inspirational quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setQuote(inspirationalQuotes[randomIndex]);
  }, []);

  return (
    <AdminLayout title="Admin Portal">
      <div className="mb-8">
        <h2 className="font-['Cinzel'] text-3xl font-bold text-[#6B4F41] mb-4">
          Welcome, {adminName}!
        </h2>
        <p className="text-[#3E3C3B] font-['Lato']">
          Use this dashboard to manage your website content. Select a section below to get started.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events Card */}
        <DashboardCard
          icon={
            <svg
              className="w-8 h-8 text-[#4A6151] mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          title="Events Management"
          description="Add, edit, or remove upcoming events. Keep your customers informed about where they can find you."
          linkTo="events"
          linkText="Manage Events"
        />

        {/* Gallery Card */}
        <DashboardCard
          icon={
            <svg
              className="w-8 h-8 text-[#4A6151] mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          title="Gallery Management"
          description="Upload, arrange, or remove images from your gallery. Showcase your best work to potential customers."
          linkTo="gallery"
          linkText="Manage Gallery"
        />
      </div>

      {/* Inspirational Message Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Daily Inspiration</h3>
        <p className="text-[#3E3C3B] font-['Lato'] mb-4 italic">"{quote}"</p>
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
