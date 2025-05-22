import React from 'react';
import tracieAndBill from '../../../assets/img/about/tracie_bill.webp';
import tree from '../../../assets/img/about/tree.webp';
import snowman from '../../../assets/img/about/snowman.webp';
import { Icon, Card } from '../../../components/ui';

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
          <Card
            title="Our Materials"
            bordered={true}
            hoverEffect={true}
            image={
              <div className="overflow-hidden rounded-full w-24 h-24">
                <img
                  src={tree}
                  alt="Cedar Tree"
                  className="w-full h-full object-cover"
                  loading={'lazy'}
                />
              </div>
            }
          >
            I only use cedar for my carvings. They are all stained with an oil based stain and
            coated with either polyurethane for a shiny finish or spar urethane for a more natural
            finish to withstand the cold and the heat.
          </Card>

          {/* Card 2: Quality Craftsmanship */}
          <Card
            title="Quality Craftsmanship"
            bordered={true}
            hoverEffect={true}
            image={
              <div className="overflow-hidden rounded-full w-24 h-24">
                <img
                  src={snowman}
                  alt="Snowman Carving"
                  className="w-full h-full object-cover"
                  loading={'lazy'}
                />
              </div>
            }
          >
            I love creating pieces that make people smile. I do my own versions of items - bears,
            sasquatches, turtles, frogs, orcas, sailors, snails, elephants, and more - all sizes
            and affordable for all budgets. The first carving I did was of a very large Snowman. I
            think he is adorable.
          </Card>

          {/* Card 3: Meet the Carver */}
          <Card
            title="Meet the Carver"
            bordered={true}
            hoverEffect={true}
            image={
              <div className="overflow-hidden rounded-full w-24 h-24">
                <img
                  src={tracieAndBill}
                  alt="Tracie and Bill"
                  className="w-full h-full object-cover"
                  loading={'lazy'}
                />
              </div>
            }
          >
            At Yelm Country Carvings, my goal is to create chainsaw carvings that are affordable
            and make people happy. This is a hobby I started with the support of my husband who
            built me a wonderful workshop. He is my inspiration.
          </Card>
        </div>

        {/* Video Placeholder */}
        {/* Changed bg-opacity-10 to /10 modifier */}
        <div className="mt-16 bg-[#A07E5D]/10 p-6 rounded-lg">
          <h3 className="font-['Cinzel'] text-xl font-bold text-[#6B4F41] mb-4 text-center">
            Hear Our Story
          </h3>
          {/* Replaced aspect-w-16 and aspect-h-9 with aspect-[16/9] */}
          <div className="aspect-[16/9] rounded-lg overflow-hidden bg-[#6B4F41] flex items-center justify-center">
            <div className="text-center p-8">
              <Icon
                type="play"
                size="xl"
                className="h-16 w-16 mx-auto text-[#F5F1E9] mb-4"
              />
              <p className="font-['Lato'] text-[#F5F1E9] text-lg">Video coming soon!</p>
              <p className="font-['Lato'] text-[#F5F1E9] text-sm mt-2 opacity-80">
                Check back later to watch our story
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
