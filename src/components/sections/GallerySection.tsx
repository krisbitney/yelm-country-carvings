import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Import all gallery images
import fishingBear from '../../assets/img/gallery/fishing_bear.webp';
import flyingHawk from '../../assets/img/gallery/flying_hawk.webp';
import frogAndSantas from '../../assets/img/gallery/frog_and_santas.webp';
import heartTrunkBear from '../../assets/img/gallery/heart_trunk_bear.webp';
import linuxPenguin from '../../assets/img/gallery/linux_penguin.webp';
import monkeyHeads from '../../assets/img/gallery/monkey_heads.webp';
import oldSailor from '../../assets/img/gallery/old_sailor.webp';
import orca from '../../assets/img/gallery/orca.webp';
import sasquatch from '../../assets/img/gallery/sasquatch.webp';
import seahawksBear from '../../assets/img/gallery/seahawks_bear.webp';
import snowman2 from '../../assets/img/gallery/snowman_2.webp';
import unpolishedElephant from '../../assets/img/gallery/unpolished_elephant.webp';
import unpolishedSmurf from '../../assets/img/gallery/unpolished_smurf.webp';
import unpolishedTurtle from '../../assets/img/gallery/unpolished_turtle.webp';
import welcomeBear from '../../assets/img/gallery/welcome_bear.webp';
import welcomeBear2 from '../../assets/img/gallery/welcome_bear_2.webp';
import welcomeBear3 from '../../assets/img/gallery/welcome_bear_3.webp';

const GallerySection: React.FC = () => {
  // State to track the selected image for the modal
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  // Function to navigate to the next image
  const navigateToNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedImage) {
      const currentIndex = galleryImages.findIndex(img => img.src === selectedImage.src);
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex]);
    }
  };

  // Function to navigate to the previous image
  const navigateToPrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedImage) {
      const currentIndex = galleryImages.findIndex(img => img.src === selectedImage.src);
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex]);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'ArrowRight') {
        navigateToNextImage();
      } else if (e.key === 'ArrowLeft') {
        navigateToPrevImage();
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Define responsive breakpoints for the carousel
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  // Array of all gallery images with their details
  const galleryImages = [
    { src: fishingBear, alt: 'Fishing Bear Carving' },
    { src: flyingHawk, alt: 'Flying Hawk Carving' },
    { src: frogAndSantas, alt: 'Frog and Santa Carvings' },
    { src: heartTrunkBear, alt: 'Bear with Heart on Trunk' },
    { src: linuxPenguin, alt: 'Linux Penguin Carving' },
    { src: monkeyHeads, alt: 'Monkey Head Carvings' },
    { src: oldSailor, alt: 'Old Sailor Carving' },
    { src: orca, alt: 'Orca Whale Carving' },
    { src: sasquatch, alt: 'Sasquatch Carving' },
    { src: seahawksBear, alt: 'Seahawks Bear Carving' },
    { src: snowman2, alt: 'Snowman Carving' },
    { src: unpolishedElephant, alt: 'Unpolished Elephant Carving' },
    { src: unpolishedSmurf, alt: 'Unpolished Smurf Carving' },
    { src: unpolishedTurtle, alt: 'Unpolished Turtle Carving' },
    { src: welcomeBear, alt: 'Welcome Bear Carving' },
    { src: welcomeBear2, alt: 'Welcome Bear Carving 2' },
    { src: welcomeBear3, alt: 'Welcome Bear Carving 3' }
  ];

  return (
    <section id="gallery" className="py-16 bg-[#F5F1E9]">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Gallery Icon */}
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Our Gallery
          </h2>
          <p className="font-['Lato'] text-lg text-[#3E3C3B] mt-3 max-w-2xl mx-auto">
            Browse through our collection of handcrafted chainsaw carvings
          </p>
        </div>

        {/* Carousel */}
        <div className="mt-8">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            pauseOnHover={true}
            customTransition="all .5s"
            transitionDuration={500}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            containerClass={"carousel-container"}
            dotListClass="carousel-dot-list"
            itemClass="carousel-item-list"
            showDots={true}
            aria-label="Gallery of chainsaw carvings"
          >
            {galleryImages.map((image, index) => (
              <div key={index} className="px-2" role="group" aria-roledescription="slide">
                <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-md">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-64 object-cover rounded-md cursor-pointer"
                      loading="lazy"
                      onClick={() => setSelectedImage(image)}
                    />
                  </div>
                  <p className="mt-2 text-center font-['Lato'] text-[#3E3C3B]">{image.alt}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="font-['Lato'] text-lg text-[#3E3C3B] mb-4">
            Interested in a custom carving? Contact us to discuss your ideas!
          </p>
          <a 
            href="#contact" 
            className="inline-block px-6 py-3 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#A07E5D] transition-colors duration-300"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Full-size Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-1001 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg z-10 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-[#3E3C3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Arrow Button */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 cursor-pointer"
            onClick={navigateToPrevImage}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6 text-[#3E3C3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 cursor-pointer"
            onClick={navigateToNextImage}
            aria-label="Next image"
          >
            <svg className="w-6 h-6 text-[#3E3C3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-2 text-center text-white font-['Lato'] text-lg">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
