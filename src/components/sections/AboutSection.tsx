import React from 'react';
import logoImage from '../../assets/logo.png';

interface AboutSectionProps {
  // Add any props if needed
}

const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section id="about" className="py-16 bg-[#F5F1E9]">
      {/* Wood Texture Divider - Top */}
      <div className="h-6 w-full wood-texture opacity-20 mb-12"></div>

      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Chainsaw Icon */}
          <svg 
            className="w-12 h-12 mx-auto mb-4 text-[#6B4F41]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 8L18 8"></path>
            <path d="M2 12L18 12"></path>
            <path d="M18 8L18 12"></path>
            <path d="M2 8L2 12"></path>
            <path d="M18 10L22 10"></path>
            <path d="M21 6L21 14"></path>
            <path d="M22 7L22 13"></path>
            <path d="M10 12L10 16"></path>
            <path d="M14 12L14 16"></path>
            <path d="M6 12L6 16"></path>
            <circle cx="4" cy="16" r="1"></circle>
            <circle cx="8" cy="16" r="1"></circle>
            <circle cx="12" cy="16" r="1"></circle>
            <circle cx="16" cy="16" r="1"></circle>
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            About Yelm Country Carvings
          </h2>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Our Story */}
          <div className="bg-[#F5F1E9] border-2 border-[#A07E5D] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Our Story</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              Yelm Country Carvings began with a passion for transforming raw timber into works of art. 
              Since 2005, we've been creating unique chainsaw carvings that bring joy and character to homes, 
              businesses, and public spaces throughout the Pacific Northwest.
            </p>
          </div>

          {/* Card 2: Quality Craftsmanship */}
          <div className="bg-[#F5F1E9] border-2 border-[#A07E5D] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Quality Craftsmanship</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              Every carving is created with meticulous attention to detail and a commitment to excellence. 
              We use only premium, locally-sourced timber and finish each piece to withstand the elements 
              while maintaining its natural beauty for years to come.
            </p>
          </div>

          {/* Card 3: Meet the Carver */}
          <div className="bg-[#F5F1E9] border-2 border-[#A07E5D] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="mb-4 overflow-hidden rounded-full w-24 h-24 mx-auto">
              {/* Carver's photo */}
              <img 
                src={logoImage} 
                alt="John Doe, Master Carver" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Meet the Carver</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              John Doe, master carver and founder, brings over 20 years of woodworking experience to each creation. 
              His unique vision and skilled hands transform ordinary logs into extraordinary characters that capture 
              the imagination and warm the heart.
            </p>
          </div>
        </div>

        {/* Video Testimonial */}
        <div className="mt-16 bg-[#A07E5D] bg-opacity-10 p-6 rounded-lg">
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Hear Our Story</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0" 
              title="Yelm Country Carvings Story"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Wood Texture Divider - Bottom */}
      <div className="h-6 w-full wood-texture opacity-20 mt-12"></div>
    </section>
  );
};

export default AboutSection;
