import React, { useState, useEffect } from 'react';

interface FooterProps {
  // Add any props if needed
}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  
  // State for newsletter form
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // State for back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Handle newsletter form submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would send the email to a newsletter service
    console.log('Newsletter subscription:', email);
    
    // Show success message
    setSubscribed(true);
    
    // Reset form
    setEmail('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };
  
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
    <footer className="bg-[#6B4F41] text-[#F5F1EM] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Copyright and Info */}
          <div>
            <h3 className="font-['Cinzel'] text-xl font-bold mb-4">Yelm Country Carvings</h3>
            <p className="font-['Lato'] mb-4">Creating Happy Chainsaw Carved Friends for Everyone</p>
            <p className="font-['Lato'] text-sm">© {currentYear} Yelm Country Carvings. All Rights Reserved.</p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-['Cinzel'] text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="font-['Lato'] hover:text-[#4A6151] transition-colors duration-300">About Us</a>
              </li>
              <li>
                <a href="#contact" className="font-['Lato'] hover:text-[#4A6151] transition-colors duration-300">Contact Us</a>
              </li>
              <li>
                <a href="#" className="font-['Lato'] hover:text-[#4A6151] transition-colors duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#faq" className="font-['Lato'] hover:text-[#4A6151] transition-colors duration-300">FAQ</a>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className="mt-6 flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#F5F1EM] hover:text-[#4A6151] transition-colors duration-300"
                aria-label="Follow us on Facebook"
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
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#F5F1EM] hover:text-[#4A6151] transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#F5F1EM] hover:text-[#4A6151] transition-colors duration-300"
                aria-label="Follow us on Pinterest"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 3: Newsletter Signup */}
          <div>
            <h3 className="font-['Cinzel'] text-xl font-bold mb-4">Stay Updated</h3>
            <p className="font-['Lato'] mb-4">Subscribe to our newsletter for updates on new carvings and upcoming events.</p>
            
            {subscribed ? (
              <div className="bg-[#4A6151] bg-opacity-30 p-4 rounded-md">
                <p className="font-['Lato']">Thank you for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit}>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151] text-[#3E3C3B]"
                    required
                  />
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-[#4A6151] text-[#F5F1EM] font-['Lato'] font-bold rounded-md hover:bg-[#A07E5D] transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-2 bg-[#B87351] text-[#F5F1EM] rounded-full shadow-md hover:bg-[#A07E5D] transition-colors duration-300"
          aria-label="Back to top"
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
      )}
    </footer>
  );
};

export default Footer;