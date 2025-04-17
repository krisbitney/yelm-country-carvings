import React, { useState } from 'react';
import woodTextureDivider from '../../assets/wood-texture-divider.jpg';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

interface EventsSectionProps {
  // Add any props if needed
}

const EventsSection: React.FC<EventsSectionProps> = () => {
  // Sample events data - in a real implementation, these would come from a CMS or props
  const events: Event[] = [
    {
      id: 1,
      title: 'Yelm Farmers Market',
      date: 'June 15, 2023',
      location: 'Yelm Community Center',
      description: 'Come see our latest carvings and watch live demonstrations throughout the day. Special discounts available for market attendees!',
      image: '/src/assets/event-1.jpg' // Placeholder path
    },
    {
      id: 2,
      title: 'Northwest Chainsaw Carving Exhibition',
      date: 'July 8-10, 2023',
      location: 'Olympia Fairgrounds',
      description: 'We\'ll be showcasing our finest work alongside other talented carvers from across the Pacific Northwest. Vote for your favorite pieces!',
      image: '/src/assets/event-2.jpg' // Placeholder path
    },
    {
      id: 3,
      title: 'Workshop Open House',
      date: 'August 20, 2023',
      location: 'Yelm Country Carvings Workshop',
      description: 'Tour our workshop, meet the carver, and see works in progress. Refreshments provided. RSVP required as space is limited.',
      image: '/src/assets/event-3.jpg' // Placeholder path
    }
  ];

  // State to track which event details are expanded
  const [expandedEvents, setExpandedEvents] = useState<number[]>([]);

  // Toggle event details expansion
  const toggleEventDetails = (eventId: number) => {
    setExpandedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  // Add event to calendar function (placeholder)
  const addToCalendar = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the event details
    console.log(`Adding event to calendar: ${event.title}`);
    // In a real implementation, this would generate an iCal file or link to a calendar service
  };

  return (
    <section id="events" className="pt-0 pb-16 bg-[#F5F1E9]">
      {/* Wood Texture Divider - Top */}
      <img src={woodTextureDivider} alt="Wood Texture Divider" className="w-full h-6 opacity-20" />

      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41] relative inline-block">
            Upcoming Events
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4A6151]"></span>
          </h2>
        </div>

        {events.length > 0 ? (
          // Event Listings
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div 
                key={event.id} 
                className="bg-[#F5F1E9] border border-[#A07E5D] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Event Image */}
                <div className="h-48 bg-[#A07E5D] bg-opacity-20 relative">
                  {/* Placeholder for event image */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#3E3C3B]">
                    Event Image Placeholder
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-2">{event.title}</h3>
                  <p className="font-['Lato'] text-[#4A6151] font-semibold mb-2">{event.date}</p>
                  <p className="font-['Lato'] text-[#3E3C3B] mb-4">{event.location}</p>

                  {/* Expandable Description */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedEvents.includes(event.id) ? 'max-h-40' : 'max-h-0'
                  }`}>
                    <p className="font-['Lato'] text-[#3E3C3B] mb-4">{event.description}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      className="px-4 py-2 bg-[#4A6151] text-[#F5F1E9] font-['Lato'] rounded-md hover:bg-[#6B4F41] transition-colors duration-300 text-sm"
                      onClick={() => toggleEventDetails(event.id)}
                    >
                      {expandedEvents.includes(event.id) ? 'Show Less' : 'Learn More'}
                    </button>
                    <button 
                      className="px-4 py-2 bg-[#A07E5D] text-[#F5F1E9] font-['Lato'] rounded-md hover:bg-[#B87351] transition-colors duration-300 text-sm flex items-center"
                      onClick={(e) => addToCalendar(event, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Fallback Message when no events
          <div className="text-center py-12 bg-[#A07E5D] bg-opacity-10 rounded-lg">
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">Stay Tuned!</h3>
            <p className="font-['Lato'] text-[#3E3C3B] mb-6">We're planning exciting events. Sign up to be notified when new events are scheduled.</p>

            {/* Event Notification Signup Form */}
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 border border-[#A07E5D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6151]"
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md hover:bg-[#A07E5D] transition-colors duration-300"
                >
                  Notify Me
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* No bottom divider as the next section will have its own top divider */}
    </section>
  );
};

export default EventsSection;
