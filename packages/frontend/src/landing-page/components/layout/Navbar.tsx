import React, { useState, useEffect, useRef, useCallback } from 'react';
import Logo from './Logo.tsx';
import { facebookLink } from '../../../constants.ts';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableElementRef = useRef<HTMLAnchorElement>(null);
  const lastFocusableElementRef = useRef<HTMLAnchorElement>(null);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle escape key press to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [mobileMenuOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#A07E5D] shadow-lg py-2' : 'bg-[#6B4F41] py-3'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center transition-transform duration-300 hover:scale-105"
          aria-label="Yelm Country Carvings - Home"
        >
          <Logo className={`${scrolled ? 'h-10' : 'h-12'} transition-all duration-300`} />
        </a>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#about"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            About
          </a>
          <a
            href="#process"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            Process
          </a>
          <a
            href="#gallery"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            Gallery
          </a>
          <a
            href="#events"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            Events
          </a>
          <a
            href="#contact"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            Contact
          </a>
          <a
            href="#directions"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            Directions
          </a>
          <a
            href="#faq"
            className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-md px-2 transition-all duration-300 py-1 border-b-2 border-transparent hover:border-[#B87351] focus:border-[#B87351]"
          >
            FAQ
          </a>

          {/* Facebook Icon */}
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] rounded-full p-1 transition-all duration-300 hover:scale-110 focus:scale-110"
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
          ref={menuButtonRef}
          className="md:hidden text-[#F5F1E9] focus:outline-none focus:ring-2 focus:ring-[#B87351] hover:text-[#B87351] transition-colors duration-300 rounded-md p-1"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
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
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`absolute top-full left-0 right-0 bg-[#6B4F41] shadow-lg md:hidden z-50 transform transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="flex flex-col p-4 space-y-4">
            <a
              ref={firstFocusableElementRef}
              href="#about"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Tab' && e.shiftKey) {
                  e.preventDefault();
                  lastFocusableElementRef.current?.focus();
                }
              }}
            >
              About
            </a>
            <a
              href="#process"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Process
            </a>
            <a
              href="#gallery"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </a>
            <a
              href="#events"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </a>
            <a
              href="#contact"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <a
              href="#directions"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Directions
            </a>
            <a
              href="#faq"
              className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>

            {/* Facebook Icon */}
            <a
              ref={lastFocusableElementRef}
              href={facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5F1E9] hover:text-[#B87351] focus:text-[#B87351] focus:outline-none focus:ring-2 focus:ring-[#B87351] transition-colors duration-300 flex items-center border-l-2 border-transparent hover:border-[#B87351] focus:border-[#B87351] pl-2 rounded-md p-1"
              aria-label="Follow us on Facebook"
              title="Follow us on Facebook"
              onClick={() => setMobileMenuOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Tab' && !e.shiftKey) {
                  e.preventDefault();
                  firstFocusableElementRef.current?.focus();
                }
              }}
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
      </div>
    </nav>
  );
};

export default Navbar;
