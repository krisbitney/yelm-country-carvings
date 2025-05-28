import { useState } from 'react';
import logoImage from '../../../assets/img/logo.webp';

const ProcessSection = () => {
  // State for lightbox and video modal
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Sample process steps - in a real implementation, these would come from a CMS or props
  const processSteps = [
    {
      id: 1,
      title: 'Step 1: Selecting the Log',
      description:
        'We carefully select premium quality logs with the right characteristics for your carving.',
      elaboration:
        'This is where additional detailed information about the process step would go. In a real implementation, each step would have more comprehensive information about the techniques, tools, and expertise involved.',
      image: logoImage,
    },
    {
      id: 2,
      title: 'Step 2: Initial Shaping',
      description:
        'Using professional-grade chainsaws, we rough out the basic form of your carving.',
      elaboration:
        'This is where additional detailed information about the process step would go. In a real implementation, each step would have more comprehensive information about the techniques, tools, and expertise involved.',
      image: logoImage,
    },
    {
      id: 3,
      title: 'Step 3: Detailed Carving',
      description:
        'Smaller chainsaws and specialized tools bring out the character and details of your piece.',
      elaboration:
        'This is where additional detailed information about the process step would go. In a real implementation, each step would have more comprehensive information about the techniques, tools, and expertise involved.',
      image: logoImage,
    },
    {
      id: 4,
      title: 'Step 4: Sanding & Smoothing',
      description: 'Each carving is carefully sanded to create a smooth, splinter-free finish.',
      elaboration:
        'This is where additional detailed information about the process step would go. In a real implementation, each step would have more comprehensive information about the techniques, tools, and expertise involved.',
      image: logoImage,
    },
    {
      id: 5,
      title: 'Step 5: Finishing Touches',
      description:
        'We apply high-quality sealants and finishes to protect your carving for years to come.',
      elaboration:
        'This is where additional detailed information about the process step would go. In a real implementation, each step would have more comprehensive information about the techniques, tools, and expertise involved.',
      image: logoImage,
    },
  ];

  // State for the active step in the carousel
  const [activeStep, setActiveStep] = useState(0);

  // Function to handle next step
  const nextStep = () => {
    setActiveStep(prev => (prev === processSteps.length - 1 ? 0 : prev + 1));
  };

  // Function to handle previous step
  const prevStep = () => {
    setActiveStep(prev => (prev === 0 ? processSteps.length - 1 : prev - 1));
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setActiveStep(index);
  };

  // Function to handle image click for lightbox
  const handleImageClick = () => {
    setLightboxOpen(true);
  };

  // Function to close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Function to open video modal
  const openVideoModal = () => {
    setVideoModalOpen(true);
  };

  // Function to close video modal
  const closeVideoModal = () => {
    setVideoModalOpen(false);
  };

  return (
    <section id="process" className="py-16 relative">
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[#A07E5D] opacity-80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41] inline-block px-6 py-2 bg-[#F5F1E9] rounded-lg">
            From Raw Material to Happy Friends
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto">
          {/* Main Image */}
          <div
            className="relative aspect-w-16 aspect-h-9 bg-[#F5F1E9] rounded-lg shadow-lg mb-6 overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            {/* Actual image */}
            <img
              src={processSteps[activeStep].image}
              alt={processSteps[activeStep].title}
              className="w-full h-full object-contain"
              loading={'lazy'}
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#3E3C3B]/70 text-[#F5F1E9] p-4">
              <h3 className="font-['Cinzel'] text-lg font-bold mb-1">
                {processSteps[activeStep].title}
              </h3>
              <p className="font-['Lato']">{processSteps[activeStep].description}</p>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <button
                className="z-10 ml-4 bg-[#3E3C3B]/50 text-[#F5F1E9] p-2 rounded-full hover:bg-[#4A6151] hover:cursor-pointer transition-colors duration-300 pointer-events-auto"
                onClick={e => {
                  e.stopPropagation();
                  prevStep();
                }}
                aria-label="Previous step"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="z-10 mr-4 bg-[#3E3C3B]/50 text-[#F5F1E9] p-2 rounded-full hover:bg-[#4A6151] hover:cursor-pointer transition-colors duration-300 pointer-events-auto"
                onClick={e => {
                  e.stopPropagation();
                  nextStep();
                }}
                aria-label="Next step"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {processSteps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === activeStep ? 'bg-[#4A6151]' : 'bg-[#A07E5D]'
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  index === activeStep ? 'ring-2 ring-[#4A6151]' : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                {/* Thumbnail image */}
                <img
                  src={step.image}
                  alt={`Thumbnail for ${step.title}`}
                  className="w-full h-full object-cover"
                  loading={'lazy'}
                />
              </div>
            ))}
          </div>

          {/* "See the Full Process" Button */}
          <div className="text-center mt-8">
            <button
              onClick={openVideoModal}
              className="inline-block px-6 py-3 bg-[#4A6151] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#6B4F41] hover:cursor-pointer transition-colors duration-300"
            >
              See the Full Process
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-[#F5F1E9] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-[#3E3C3B]/50 text-[#F5F1E9] p-2 rounded-full hover:bg-[#4A6151] hover:cursor-pointer transition-colors duration-300"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Lightbox content */}
            <div className="p-8">
              <h2 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">
                {processSteps[activeStep].title}
              </h2>

              <div className="mb-6">
                <img
                  src={processSteps[activeStep].image}
                  alt={processSteps[activeStep].title}
                  className="w-full h-auto max-h-[50vh] object-contain mx-auto"
                  loading={'lazy'}
                />
              </div>

              <div className="prose max-w-none">
                <p className="font-['Lato'] text-[#3E3C3B] text-lg">
                  {processSteps[activeStep].description}
                </p>
                <p className="font-['Lato'] text-[#3E3C3B] mt-4">
                  {processSteps[activeStep].elaboration}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-[#F5F1E9] rounded-lg max-w-4xl w-full overflow-hidden">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-[#3E3C3B]/50 text-[#F5F1E9] p-2 rounded-full hover:bg-[#4A6151] hover:cursor-pointer transition-colors duration-300 z-10"
              onClick={closeVideoModal}
              aria-label="Close video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Video content */}
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0&autoplay=1"
                title="Yelm Country Carvings - Full Process"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProcessSection;
