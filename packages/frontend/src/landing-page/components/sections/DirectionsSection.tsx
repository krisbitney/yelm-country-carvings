const DirectionsSection = () => {
  // Function to handle "Get Directions" button click
  const handleGetDirections = () => {
    // Open Google Maps with the address pre-filled
    window.open(
      'https://www.google.com/maps/search/?api=1&query=19438+Cook+Road+Southeast+Yelm+Washington+98597+United+States',
      '_blank'
    );
  };

  return (
    <section id="directions" className="py-16 bg-[#F5F1E9]">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {/* Map Pin Icon */}
          <svg
            className="w-12 h-12 mx-auto mb-4 text-[#6B4F41]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            Visit Our Workshop
          </h2>
          <p className="font-['Lato'] text-lg text-[#3E3C3B] mt-3 max-w-2xl mx-auto">
            Come see our chainsaw art creations in person and watch our artists at work!
          </p>
        </div>

        {/* Address and Hours Card */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">Our Location</h3>
            <address className="not-italic font-['Lato'] text-lg text-[#3E3C3B] mb-4">
              <p className="font-bold">Yelm Country Carvings</p>
              <p>19438 Cook Road Southeast</p>
              <p>Yelm, Washington 98597</p>
              <p>United States</p>
              <p className="mt-4">
                <a href="tel:+12532789814" className="text-[#B87351] hover:underline">
                  (253) 278-9814
                </a>
              </p>
            </address>
            <button
              onClick={handleGetDirections}
              className="mt-4 px-6 py-3 bg-[#B87351] text-[#F5F1E9] font-['Lato'] font-bold rounded-md shadow-md hover:bg-[#A07E5D] transition-colors duration-300 flex items-center cursor-pointer"
              aria-label="Get directions to Yelm Country Carvings on Google Maps"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Get Directions
            </button>
          </div>

          {/* Hours Information */}
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">
              Workshop Hours
            </h3>
            <div className="font-['Lato'] text-lg text-[#3E3C3B]">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Monday - Friday:</div>
                <div>By Appointment</div>

                <div className="font-bold">Saturday:</div>
                <div>10:00 AM - 4:00 PM</div>

                <div className="font-bold">Sunday:</div>
                <div>10:00 AM - 4:00 PM</div>
              </div>
              <p className="mt-4 text-[#B87351] font-semibold">
                * Custom appointments available upon request
              </p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          {/* Google Maps iframe */}
          {/* Replaced aspect-w-16 aspect-h-9 with aspect-[16/9] */}
          <div className="aspect-[16/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.2108553401394!2d-122.6047235!3d46.9421499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zNDfCsDA1JzMxLjgiTiAxMjLCsDM2JzE3LjAiVw!5e0!3m2!1sen!2sus!4v1625152486789!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Interactive map showing Yelm Country Carvings at 19438 Cook Road Southeast, Yelm, Washington 98597"
              className="absolute inset-0"
              aria-label="Google Maps showing the location of Yelm Country Carvings"
            ></iframe>
          </div>
        </div>

        {/* Travel Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nearby Landmarks */}
          {/* Changed bg-opacity-10 to /10 modifier */}
          <div className="bg-[#A07E5D]/10 p-6 rounded-lg">
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">
              Nearby Landmarks
            </h3>
            <ul className="list-disc list-inside font-['Lato'] text-[#3E3C3B] space-y-2">
              <li>Just 2 miles east of Yelm Prairie Park</li>
              <li>Across from the Nisqually River Nature Trail</li>
              <li>5 minutes from downtown Yelm</li>
              <li>Look for the large wooden bear carving at our driveway entrance!</li>
            </ul>
          </div>

          {/* Directions Tips */}
          {/* Changed bg-opacity-10 to /10 modifier */}
          <div className="bg-[#A07E5D]/10 p-6 rounded-lg">
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4">Travel Tips</h3>
            <ul className="list-disc list-inside font-['Lato'] text-[#3E3C3B] space-y-2">
              <li>From I-5, take exit 116 toward Yelm/Tenino</li>
              <li>Follow SR-507 S for approximately 15 miles</li>
              <li>Ample parking available on-site</li>
              <li>Wheelchair accessible entrance and viewing area</li>
              <li>Pet-friendly outdoor areas (leashed pets only)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectionsSection;
