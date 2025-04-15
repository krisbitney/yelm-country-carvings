import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface NavbarProps {
  // Add any props if needed
}

const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for the navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#A07E5D] shadow-md' : 'bg-[#6B4F41]'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          className="flex items-center transition-transform duration-300 hover:scale-105"
          aria-label="Yelm Country Carvings - Home"
        >
          <Logo />
        </a>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#about" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">About</a>
          <a href="#process" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">Process</a>
          <a href="#events" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">Events</a>
          <a href="#contact" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">Contact</a>
          <a href="#faq" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">FAQ</a>

          {/* Facebook Icon */}
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#F5F1E9] hover:text-[#4A6151] transition-colors duration-300"
            aria-label="Follow us on Facebook"
            title="Follow us on Facebook"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#F5F1E9] focus:outline-none"
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              // X icon when menu is open
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              // Hamburger icon when menu is closed
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#6B4F41] shadow-md md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <a href="#about" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">About</a>
              <a href="#process" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">Process</a>
              <a href="#events" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">Events</a>
              <a href="#contact" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">Contact</a>
              <a href="#faq" className="font-['Lato'] text-[#F5F1E9] hover:text-[#A07E5D] transition-colors duration-300">FAQ</a>

              {/* Facebook Icon */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#F5F1E9] hover:text-[#4A6151] transition-colors duration-300 flex items-center"
                aria-label="Follow us on Facebook"
                title="Follow us on Facebook"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Follow us on Facebook
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
