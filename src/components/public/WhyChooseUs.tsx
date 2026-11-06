import React from 'react';
import { Flame, Sparkles, Wheat, Truck, ShieldCheck, HeartPulse } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
}

export const WhyChooseUs: React.FC<Props> = ({ settings }) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'flame':
        return <Flame className="w-6 h-6 text-[#E63932]" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'wheat':
        return <Wheat className="w-6 h-6 text-yellow-500" />;
      case 'truck':
        return <Truck className="w-6 h-6 text-emerald-400" />;
      default:
        return <Flame className="w-6 h-6 text-[#E63932]" />;
    }
  };

  const pillars =
    settings.whyChooseUs && settings.whyChooseUs.length > 0
      ? settings.whyChooseUs
      : [
          {
            title: 'Freshly Smashed Gourmet Patties',
            description: 'Never frozen. 100% prime cut beef and tender chicken breast grilled on high heat for that coveted caramelized crunch crust.',
            icon: 'Flame',
          },
          {
            title: 'Secret House Sauces',
            description: 'Our signature smoky chipotle, garlic herb crema, and fiery spicy dragon sauce blended fresh every morning.',
            icon: 'Sparkles',
          },
          {
            title: 'Artisan Toasted Brioche',
            description: 'Golden, pillow-soft brioche buns gently toasted in rich butter to hold all the succulent juices.',
            icon: 'Wheat',
          },
          {
            title: 'Fast & Sizzling Delivery',
            description: 'Hot-bag thermal packaging ensuring your loaded fries stay crisp and your burgers stay piping hot.',
            icon: 'Truck',
          },
        ];

  return (
    <section id="why-us" className="py-20 bg-[#101010] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>THE BURGER BITE DIFFERENCE</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
            WHY FOODIES IN PESHAWAR <span className="text-[#E63932]">CHOOSE US</span>
          </h2>
          <p className="text-sm sm:text-base text-[#B8B8B8] mt-3">
            We don't do lukewarm shortcuts. From butcher to grill to bun, every step is built around explosive flavor and maximum crunch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#171717] rounded-2xl p-6 border border-[#252525] hover:border-[#3a3a3a] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E63932]/5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#222222] border border-[#2e2e2e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {getIcon(pillar.icon)}
              </div>
              <h3 className="font-bold text-lg text-white mb-2.5 group-hover:text-[#E63932] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#B8B8B8] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
