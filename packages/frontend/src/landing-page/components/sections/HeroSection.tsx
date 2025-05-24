import React from 'react';
import backgroundImage from '../../../assets/img/logo_with_wood_background_wide.webp';

// Define the CSS animation
const zoomInOutAnimation = `
@keyframes zoomInOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
`;

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Add animation styles */}
      <style dangerouslySetInnerHTML={{ __html: zoomInOutAnimation }} />

      {/* Visually hidden h1 for SEO and accessibility */}
      <h1 className="sr-only">
        Yelm Country Carvings - Handcrafted Chainsaw Art in Yelm, Washington
      </h1>

      {/* Background Slideshow */}
      <div className="absolute inset-0 bg-[#A07E5D]/80 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            animation: 'zoomInOut 20s infinite alternate ease-in-out',
          }}
          role="img"
          aria-label="Yelm Country Carvings logo with wooden background"
        ></div>
      </div>

      {/* Mobile Layout - Flex column with content at opposite ends */}
      <div className="md:hidden relative z-10 w-full flex flex-col items-center justify-between h-3/4 py-8">
        {/* Top Content */}
        <div className="mt-12 flex flex-col items-center">
          <div className="bg-[#3A2718]/80 p-4 rounded-lg border border-[#F5F1E9] shadow-xl inline-block">
            {/* Headline */}
            <h2 className="text-[#F5F1E9] text-xl font-bold mb-2 font-['Lato'] text-center">
              Handcrafted Chainsaw Art
            </h2>

            {/* Description */}
            <p className="text-[#F5F1E9] text-sm mb-4 font-['Lato'] text-center">
              Creating happy chainsaw carved friends for everyone.
            </p>

            {/* Primary CTA Button */}
            <div className="flex justify-center">
              <a
                href="#process"
                className="px-5 py-2 bg-[#B87351] text-[#F5F1E9] text-sm font-['Lato'] font-bold rounded-lg border-2 border-[#F5F1E9] shadow-lg hover:bg-[#A07E5D] hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Explore Our Creations
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="mb-12 flex flex-col items-center">
          <div className="bg-[#3A2718]/80 p-4 rounded-lg border border-[#F5F1E9] shadow-xl inline-block">
            {/* Headline */}
            <h2 className="text-[#F5F1E9] text-xl font-bold mb-2 font-['Lato'] text-center">
              Design Your Dream Wood Carving
            </h2>

            {/* Description */}
            <p className="text-[#F5F1E9] text-sm mb-4 font-['Lato'] text-center">
              Unique wooden sculptures and custom carvings created with passion in Yelm, Washington.
            </p>

            {/* Secondary CTA Button */}
            <div className="flex justify-center">
              <a
                href="#contact"
                className="px-5 py-2 bg-[#A07E5D] text-[#F5F1E9] text-sm font-['Lato'] font-bold rounded-lg border-2 border-[#F5F1E9] shadow-lg hover:bg-[#B87351] hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Get a Custom Quote
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex relative z-10 w-full mt-24 md:mt-32 lg:mt-40">
        {/* Left Side Content - Exactly 25% width */}
        <div className="w-1/4 flex justify-start pl-4 md:pl-8 lg:pl-12">
          <div className="bg-[#3A2718]/80 p-6 rounded-lg border border-[#F5F1E9] shadow-xl flex flex-col h-full justify-between">
            <div>
              {/* Headline */}
              <h2 className="text-[#F5F1E9] text-2xl lg:text-3xl font-bold mb-3 font-['Lato'] text-center">
                Handcrafted Chainsaw Art
              </h2>

              {/* Description */}
              <p className="text-[#F5F1E9] text-base lg:text-lg mb-6 font-['Lato'] text-center">
                Creating happy chainsaw carved friends for everyone.
              </p>
            </div>

            {/* Primary CTA Button */}
            <div className="flex justify-center mt-auto">
              <a
                href="#process"
                className="px-6 py-3 bg-[#B87351] text-[#F5F1E9] text-base lg:text-lg font-['Lato'] font-bold rounded-lg border-2 border-[#F5F1E9] shadow-lg hover:bg-[#A07E5D] hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Explore Our Creations
              </a>
            </div>
          </div>
        </div>

        {/* Empty Middle Section - Exactly 50% width */}
        <div className="w-1/2"></div>

        {/* Right Side Content - Exactly 25% width */}
        <div className="w-1/4 flex justify-end pr-4 md:pr-8 lg:pr-12">
          <div className="bg-[#3A2718]/80 p-6 rounded-lg border border-[#F5F1E9] shadow-xl flex flex-col h-full justify-between">
            <div>
              {/* Headline */}
              <h2 className="text-[#F5F1E9] text-2xl lg:text-3xl font-bold mb-3 font-['Lato'] text-center">
                Design Your Dream Wood Carving
              </h2>

              {/* Description */}
              <p className="text-[#F5F1E9] text-base lg:text-lg mb-6 font-['Lato'] text-center">
                Unique wooden sculptures and custom carvings created with passion in Yelm,
                Washington.
              </p>
            </div>

            {/* Secondary CTA Button */}
            <div className="flex justify-center mt-auto">
              <a
                href="#contact"
                className="px-6 py-3 bg-[#A07E5D] text-[#F5F1E9] text-base lg:text-lg font-['Lato'] font-bold rounded-lg border-2 border-[#F5F1E9] shadow-lg hover:bg-[#B87351] hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator - Centered at the bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <a
          href="#about"
          className="block animate-bounce hover:text-[#B87351] hover:scale-110 transition-all duration-300 hover:cursor-pointer"
          aria-label="Scroll to About section"
        >
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
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
