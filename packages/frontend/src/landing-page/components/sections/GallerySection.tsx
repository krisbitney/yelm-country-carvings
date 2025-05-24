import React, { useState, useCallback } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useGalleryImages } from '../../hooks/useGalleryImages.tsx';
import { GalleryIcon, PreviousIcon, NextIcon } from '../../../components/ui/icons';
import {
  SectionHeader,
  Button,
  ResponsiveImage,
  Modal,
  IconButton,
  LoadingSpinner,
} from '../../../components/ui';

const GallerySection: React.FC = () => {
  // State to track the selected image for the modal
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt?: string } | null>(null);

  const { data: galleryImages, loading, error } = useGalleryImages();

  // Function to navigate to the next image
  const navigateToNextImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (selectedImage) {
        const currentIndex = galleryImages.findIndex(img => img.src === selectedImage.src);
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setSelectedImage(galleryImages[nextIndex]);
      }
    },
    [galleryImages, selectedImage]
  );

  // Function to navigate to the previous image
  const navigateToPrevImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (selectedImage) {
        const currentIndex = galleryImages.findIndex(img => img.src === selectedImage.src);
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setSelectedImage(galleryImages[prevIndex]);
      }
    },
    [galleryImages, selectedImage]
  );

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
  }, [selectedImage, galleryImages, navigateToNextImage, navigateToPrevImage]);

  // Define responsive breakpoints for the carousel
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section id="gallery" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<GalleryIcon className="w-12 h-12" />}
          title="Our Gallery"
          description="Browse through our collection of handcrafted chainsaw carvings"
        />

        {/* Carousel */}
        <div className="mt-8">
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4"
              role="alert"
            >
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {loading && !error ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" color="primary" />
            </div>
          ) : (
            <Carousel
              responsive={responsive}
              infinite={galleryImages.length > 1}
              autoPlay={galleryImages.length > 1}
              autoPlaySpeed={5000}
              keyBoardControl={true}
              pauseOnHover={true}
              customTransition="all .5s"
              transitionDuration={500}
              removeArrowOnDeviceType={['tablet', 'mobile']}
              containerClass="carousel-container"
              dotListClass="carousel-dot-list"
              itemClass="carousel-item-list"
              showDots={galleryImages.length > 1}
              aria-label="Gallery of chainsaw carvings"
              ssr={true} // Server-side rendering support
              partialVisible={false}
            >
              {galleryImages.map(image => (
                <div key={image.id} className="px-2" role="group" aria-roledescription="slide">
                  <div className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="rounded-md overflow-hidden">
                      <ResponsiveImage
                        src={image.src}
                        alt={image.alt || 'Gallery image'}
                        aspectRatio="4:3"
                        className="h-64 rounded-md cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    {image.alt && (
                      <p className="mt-3 text-center font-body text-neutral-dark">{image.alt}</p>
                    )}
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="font-body text-lg text-neutral-dark mb-4">
            Interested in a custom carving? Contact us to discuss your ideas!
          </p>
          <Button href="#contact" variant="accent">
            Get in Touch
          </Button>
        </div>
      </div>

      {/* Full-size Image Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        className="max-w-5xl max-h-[90vh]"
      >
        {galleryImages.length > 1 && (
          <>
            {/* Left Arrow Button */}
            <IconButton
              icon={<PreviousIcon className="w-6 h-6" />}
              variant="light"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 hover:bg-white/20 transition-colors"
              onClick={navigateToPrevImage}
              ariaLabel="Previous image"
            />

            {/* Right Arrow Button */}
            <IconButton
              icon={<NextIcon className="w-6 h-6" />}
              variant="light"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hover:bg-white/20 transition-colors"
              onClick={navigateToNextImage}
              ariaLabel="Next image"
            />
          </>
        )}

        {selectedImage && (
          <div className="relative overflow-auto p-2">
            <div className="flex flex-col items-center w-full">
              <ResponsiveImage
                src={selectedImage.src}
                alt={selectedImage.alt || 'Selected image'}
                className="w-auto h-auto max-w-full max-h-[80vh] rounded-lg shadow-xl"
                objectFit="contain"
                aspectRatio="auto"
                onClick={(
                  e:
                    | React.MouseEvent<HTMLImageElement, MouseEvent>
                    | React.KeyboardEvent<HTMLImageElement>
                ) => e.stopPropagation()}
              />
              {selectedImage.alt && (
                <p className="mt-4 text-center text-white font-body text-lg px-4">
                  {selectedImage.alt}
                </p>
              )}

              {galleryImages.length > 1 && (
                <div className="mt-4 text-white text-sm">
                  Image {galleryImages.findIndex(img => img.src === selectedImage.src) + 1} of{' '}
                  {galleryImages.length}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default GallerySection;
