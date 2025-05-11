import React from 'react';
import Navbar from './components/layout/Navbar.tsx';
import HeroSection from './components/sections/HeroSection.tsx';
import AboutSection from './components/sections/AboutSection.tsx';
import ProcessSection from './components/sections/ProcessSection.tsx';
import GallerySection from './components/sections/GallerySection.tsx';
import EventsSection from './components/sections/EventsSection.tsx';
import ContactSection from './components/sections/ContactSection.tsx';
import DirectionsSection from './components/sections/DirectionsSection.tsx';
import FAQSection from './components/sections/FAQSection.tsx';
import Footer from './components/layout/Footer.tsx';

/**
 * MainWebsite component that renders the public-facing website
 */
const MainWebsite: React.FC = () => {
  return (
    <div className="font-['Lato'] text-[#3E3C3B]">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProcessSection />
        <GallerySection />
        <EventsSection />
        <ContactSection />
        <DirectionsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default MainWebsite;