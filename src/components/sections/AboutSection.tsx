import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="pt-16 pb-16 bg-[#F5F1E9]">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
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
            <div className="mb-4 overflow-hidden rounded-full w-24 h-24 mx-auto bg-[#6B4F41] flex items-center justify-center">
              {/* Carver's icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#F5F1E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Meet the Carver</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              Our master carver and founder brings over 20 years of woodworking experience to each creation. 
              With a unique vision and skilled hands, we transform ordinary logs into extraordinary characters that capture 
              the imagination and warm the heart.
            </p>
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="mt-16 bg-[#A07E5D] bg-opacity-10 p-6 rounded-lg">
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Hear Our Story</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-[#6B4F41] flex items-center justify-center">
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#F5F1E9] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-['Lato'] text-[#F5F1E9] text-lg">Video coming soon!</p>
              <p className="font-['Lato'] text-[#F5F1E9] text-sm mt-2 opacity-80">Check back later to watch our story</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;
