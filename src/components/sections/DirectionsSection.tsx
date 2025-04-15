import React from 'react';

interface DirectionsSectionProps {
  // Add any props if needed
}

const DirectionsSection: React.FC<DirectionsSectionProps> = () => {
  // Function to handle "Get Directions" button click
  const handleGetDirections = () => {
    // In a real implementation, this would open Google Maps with the address pre-filled
    window.open('https://www.google.com/maps/search/?api=1&query=Yelm+Country+Carvings+Yelm+WA', '_blank');
  };

  return (
    <section id="directions" className="py-16 bg-[#F5F1E9]">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Map Pin Icon */}
          <svg 
            className="w-12 h-12 mx-auto mb-4 text-[#6B4F41]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Find Our Workshop
          </h2>
        </div>

        {/* Map Container */}
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          {/* Placeholder for Google Map - In a real implementation, this would be replaced with an actual Google Maps embed */}
          <div className="aspect-w-16 aspect-h-9 bg-[#A07E5D] bg-opacity-20">
            {/* This is a placeholder. In a real implementation, you would use the Google Maps API or an iframe */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-['Lato'] text-[#3E3C3B] text-xl">Google Map Placeholder</p>
            </div>
          </div>

          {/* Map Overlay with Get Directions Button */}
          <div className="absolute bottom-6 right-6">
            <button 
              onClick={handleGetDirections}
              className="px-6 py-3 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#A07E5D] transition-colors duration-300 flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                />
              </svg>
              Get Directions
            </button>
          </div>
        </div>

        {/* Nearby Landmarks */}
        <div className="mt-8 bg-[#A07E5D] bg-opacity-10 p-6 rounded-lg">
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Nearby Landmarks</h3>
          <ul className="list-disc list-inside font-['Lato'] text-[#3E3C3B] space-y-2">
            <li>Just 2 miles east of Yelm Prairie Park</li>
            <li>Across from the Nisqually River Nature Trail</li>
            <li>5 minutes from downtown Yelm</li>
            <li>Look for the large wooden bear carving at our driveway entrance!</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DirectionsSection;
