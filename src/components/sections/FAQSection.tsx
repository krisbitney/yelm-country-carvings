import React, { useState } from 'react';
import woodTextureDivider from '../../assets/wood-texture-divider.jpg';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  // Add any props if needed
}

const FAQSection: React.FC<FAQSectionProps> = () => {
  // Sample FAQ data - in a real implementation, these would come from a CMS or props
  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How long does it take to complete a custom carving?',
      answer: 'The timeframe varies depending on the size and complexity of the carving. Small pieces may take 1-2 days, while larger or more detailed carvings can take 1-2 weeks. We\'ll provide you with a specific timeline when you request a quote.'
    },
    {
      id: 2,
      question: 'Do you offer delivery services?',
      answer: 'Yes, we offer delivery within a 50-mile radius of Yelm for a small fee. For larger pieces or longer distances, we can arrange shipping or delivery through a third-party service. Contact us for a delivery quote.'
    },
    {
      id: 3,
      question: 'How should I maintain my wood carving?',
      answer: 'Our carvings are sealed with high-quality finishes to protect them from the elements. For outdoor carvings, we recommend reapplying a clear sealant annually. Keep carvings away from direct water exposure and extreme heat. Dust indoor carvings regularly with a soft cloth.'
    },
    {
      id: 4,
      question: 'Can I request a specific type of wood for my carving?',
      answer: 'We primarily work with cedar and pine, which are excellent for outdoor durability and carving detail. If you have a specific wood type in mind, please ask, and we\'ll let you know if it\'s suitable for your project.'
    },
    {
      id: 5,
      question: 'Do you offer any warranty on your carvings?',
      answer: 'Yes, all our carvings come with a 1-year warranty against defects in craftsmanship. This doesn\'t cover natural wood characteristics like checking (small cracks) which can occur as wood adjusts to its environment.'
    }
  ];

  // State to track which FAQ items are expanded
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);

  // Toggle FAQ expansion
  const toggleFAQ = (faqId: number) => {
    setExpandedFAQs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId) 
        : [...prev, faqId]
    );
  };


  return (
    <section id="faq" className="pt-0 pb-16 bg-[#F5F1E9]">
      {/* Wood Texture Divider - Top */}
      <img src={woodTextureDivider} alt="Wood Texture Divider" className="w-full h-6 opacity-20" />

      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Question Mark Icon */}
          <svg 
            className="w-12 h-12 mx-auto mb-4 text-[#6B4F41]" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z" />
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Frequently Asked Questions
          </h2>
        </div>


        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
              {faqs.map(faq => (
                <div 
                  key={faq.id} 
                  className="border border-[#A07E5D] rounded-md overflow-hidden"
                >
                  {/* Question (Header) */}
                  <button 
                    className="w-full px-6 py-4 text-left bg-[#F5F1E9] hover:bg-[#A07E5D] hover:bg-opacity-10 flex justify-between items-center transition-colors duration-300"
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={expandedFAQs.includes(faq.id)}
                  >
                    <span className="font-['Cinzel'] font-bold text-[#6B4F41]">{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 text-[#4A6151] transform transition-transform duration-300 ${
                        expandedFAQs.includes(faq.id) ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Answer */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFAQs.includes(faq.id) ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 py-4 bg-white">
                      <p className="font-['Lato'] text-[#3E3C3B]">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {/* "Still Have Questions?" Link */}
          <div className="text-center mt-12">
            <p className="font-['Lato'] text-[#3E3C3B] mb-4">Still have questions?</p>
            <a 
              href="#contact" 
              className="inline-block px-6 py-3 bg-[#4A6151] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#6B4F41] transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
