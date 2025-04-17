import React, { useState, useEffect } from 'react';

interface FooterProps {
  // Add any props if needed
}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  // State for back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-[#6B4F41] text-[#F5F1E9] py-12 border-t-4 border-[#A07E5D] relative">
      {/* Decorative wood grain pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-repeat" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgdmlld0JveD0iMCAwIDcwIDcwIj48cGF0aCBkPSJNNjUsMzVBMzAsMzAgMCAxLDEgMzUsNSw2NSw2NSAwIDAsMS02NSwzNSw2NSw2NSAwIDAsMS0zNSw2NSwzMCwzMCAwIDEsMSAzNSwzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjVGMUU5IiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')"
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {/* Column 1: Copyright and Info */}
          <div className="md:w-full px-4 md:pr-8 animate-slideInUp">
            <h3 className="font-['Cinzel'] text-2xl font-bold mb-4 text-[#F5F1E9] border-b-2 border-[#B87351] pb-2 inline-block">Yelm Country Carvings</h3>
            <p className="font-['Lato'] mb-4 text-[#F5F1E9] opacity-90 mt-4">Creating Happy Chainsaw Carved Friends for Everyone</p>
            <p className="font-['Lato'] text-sm text-[#F5F1E9] opacity-80 mt-6">© {currentYear} Yelm Country Carvings. All Rights Reserved.</p>

            {/* Location info */}
            <div className="mt-4 flex items-center text-[#F5F1E9] opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Yelm, Washington</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:w-full px-4 md:px-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-['Cinzel'] text-xl font-bold mb-4 text-[#F5F1E9] border-b-2 border-[#B87351] pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3 mt-4">
              <li className="transform hover:translate-x-1 transition-transform duration-300">
                <a 
                  href="#about" 
                  className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] transition-all duration-300 border-b border-transparent hover:border-[#B87351] pb-1 inline-block"
                >
                  About Us
                </a>
              </li>
              <li className="transform hover:translate-x-1 transition-transform duration-300">
                <a 
                  href="#contact" 
                  className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] transition-all duration-300 border-b border-transparent hover:border-[#B87351] pb-1 inline-block"
                >
                  Contact Us
                </a>
              </li>
              <li className="transform hover:translate-x-1 transition-transform duration-300">
                <a 
                  href="#terms" 
                  className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] transition-all duration-300 border-b border-transparent hover:border-[#B87351] pb-1 inline-block"
                >
                  Terms & Privacy
                </a>
              </li>
              <li className="transform hover:translate-x-1 transition-transform duration-300">
                <a 
                  href="#faq" 
                  className="font-['Lato'] text-[#F5F1E9] hover:text-[#B87351] transition-all duration-300 border-b border-transparent hover:border-[#B87351] pb-1 inline-block"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="md:w-full px-4 md:pl-8 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-['Cinzel'] text-xl font-bold mb-4 text-[#F5F1E9] border-b-2 border-[#B87351] pb-2 inline-block">Connect With Us</h3>
            <div className="mt-4 flex flex-col">
              <a 
                href="https://www.facebook.com/YelmCountryCarvings" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#F5F1E9] hover:text-[#B87351] transition-all duration-300 hover:scale-110 animate-pulse flex items-center"
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
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#A07E5D] border-opacity-30 text-center">
          <p className="text-sm opacity-70">
            Handcrafted with <span className="text-[#B87351]">♥</span> in the Pacific Northwest
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <div 
        className={`fixed bottom-8 right-8 transform transition-all duration-500 ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <button 
          onClick={scrollToTop}
          className="p-3 bg-[#B87351] text-[#F5F1E9] rounded-full shadow-lg hover:bg-[#A07E5D] transition-all duration-300 hover:shadow-xl transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#F5F1E9] focus:ring-opacity-50"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
