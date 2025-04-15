import React from 'react';
import backgroundImage from '../../assets/logo_with_wood_background.png';

interface HeroSectionProps {
  // Add any props if needed
}

const HeroSection: React.FC<HeroSectionProps> = () => {
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

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Headline */}
        <h1 
          className="font-['Cinzel'] font-bold text-4xl md:text-5xl lg:text-6xl text-[#F5F1E9] mb-4 drop-shadow-lg"
          style={{ textShadow: '2px 2px 4px rgba(62, 60, 59, 0.5)' }}
        >
          Yelm Country Carvings
        </h1>

        {/* Subtitle with animation */}
        <p 
          className="font-['Lato'] text-xl md:text-2xl text-[#F5F1E9] mb-8 opacity-0 animate-fadeIn"
          style={{ 
            textShadow: '1px 1px 2px rgba(62, 60, 59, 0.5)',
            animation: 'fadeIn 1s ease-in forwards 0.5s'
          }}
        >
          Creating Happy Chainsaw Carved Friends for Everyone
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Primary CTA Button */}
          <a 
            href="#process" 
            className="px-6 py-3 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#A07E5D] transition-colors duration-300"
            style={{ animation: 'pulse 2s infinite' }}
          >
            Explore Our Creations
          </a>

          {/* Secondary CTA Button */}
          <a 
            href="#contact" 
            className="px-6 py-3 bg-[#A07E5D] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#B87351] transition-colors duration-300"
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
