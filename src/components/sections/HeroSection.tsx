import React from 'react';
import backgroundImage from '../../assets/logo_with_wood_background_16x9.png';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 bg-[#A07E5D] bg-opacity-80 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-60"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            animation: 'zoomInOut 20s infinite alternate ease-in-out'
          }}
        ></div>
      </div>

      {/* Content Container - Positioned lower on the page */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-24 md:mt-32 lg:mt-40">
        {/* Main Title */}
        <h1 className="font-['Cinzel'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F1E9] mb-8 animate-fadeIn" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          Yelm Country Carvings
        </h1>
        <p className="font-['Lato'] text-xl md:text-2xl text-[#F5F1E9] mb-12 animate-slideInUp" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
          Handcrafted Chainsaw Art from the Pacific Northwest
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {/* Primary CTA Button */}
          <a 
            href="#process" 
            className="px-8 py-4 bg-[#B87351] text-[#F5F1E9] text-lg font-['Lato'] font-bold rounded-lg border-2 border-[#F5F1E9] shadow-lg hover:bg-[#A07E5D] hover:scale-105 transition-all duration-300"
            style={{ 
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}
          >
            Explore Our Creations
          </a>

          {/* Secondary CTA Button */}
          <a 
            href="#contact" 
            className="px-8 py-4 bg-[#A07E5D] text-[#F5F1E9] text-lg font-['Lato'] font-bold rounded-lg border-2 border-[#F5F1E9] shadow-lg hover:bg-[#B87351] hover:scale-105 transition-all duration-300"
            style={{ 
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}
          >
            Get a Custom Quote
          </a>
        </div>
      </div>

      {/* Optional: Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-[#F5F1E9]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
