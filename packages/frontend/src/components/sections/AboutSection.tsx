import React from 'react';
import tracieAndBill from '../../assets/img/about/tracie_bill.webp';
import tree from '../../assets/img/about/tree.webp';
import snowman from '../../assets/img/about/snowman.webp';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="pt-16 pb-16 bg-[#F5F1E9]">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#6B4F41]">
            About Yelm Country Carvings
          </h2>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Our Story */}
          <div className="bg-[#F5F1E9] border-2 border-[#A07E5D] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
            <div className="mb-4 overflow-hidden rounded-full w-24 h-24 mx-auto">
              {/* Tree image */}
              <img
                src={tree}
                alt="Cedar Tree"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Our Materials</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              I only use cedar for my carvings. They are all stained with an oil based stain and coated with either polyurethane for a shiny finish or spar urethane for a more natural finish to withstand the cold and the heat.
            </p>
          </div>

          {/* Card 2: Quality Craftsmanship */}
          <div className="bg-[#F5F1E9] border-2 border-[#A07E5D] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
            <div className="mb-4 overflow-hidden rounded-full w-24 h-24 mx-auto">
              {/* Snowman image */}
              <img
                src={snowman}
                alt="Snowman Carving"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Quality Craftsmanship</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              I love creating pieces that make people smile. I do my own versions of items - bears, sasquatches, turtles, frogs, orcas, sailors, snails, elephants, and more - all sizes and affordable for all budgets. The first carving I did was of a very large Snowman. I think he is adorable.
            </p>
          </div>

          {/* Card 3: Meet the Carver */}
          <div className="bg-[#F5F1E9] border-2 border-[#A07E5D] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
            <div className="mb-4 overflow-hidden rounded-full w-24 h-24 mx-auto">
              {/* Carver's image */}
              <img
                src={tracieAndBill}
                alt="Tracie and Bill"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Meet the Carver</h3>
            <p className="font-['Lato'] text-[#3E3C3B]">
              At Yelm Country Carvings, my goal is to create chainsaw carvings that are affordable and make people happy. This is a hobby I started with the support of my husband who built me a wonderful workshop. He is my inspiration.
            </p>
          </div>
        </div>

        {/* Video Placeholder */}
        {/* Changed bg-opacity-10 to /10 modifier */}
        <div className="mt-16 bg-[#A07E5D]/10 p-6 rounded-lg">
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">Hear Our Story</h3>
          {/* Replaced aspect-w-16 and aspect-h-9 with aspect-[16/9] */}
          <div className="aspect-[16/9] rounded-lg overflow-hidden bg-[#6B4F41] flex items-center justify-center">
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#F5F1E9] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-['Lato'] text-[#F5F1E9] text-lg">Video coming soon!</p>
              <p className="font-['Lato'] text-[#F5F1E9] text-sm mt-2 opacity-80">Check back later to watch our story</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;