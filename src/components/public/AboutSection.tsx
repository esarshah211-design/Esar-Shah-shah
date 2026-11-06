import React from 'react';
import { Flame, CheckCircle2, Award, HeartHandshake } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
}

export const AboutSection: React.FC<Props> = ({ settings }) => {
  return (
    <section id="about" className="py-20 bg-[#171717] relative border-y border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Grid Imagery */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#333]">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
                  alt="Gourmet Smash Patty Sizzling on Grill"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 rounded-2xl bg-[#222222] border border-[#333] flex flex-col justify-center">
                <span className="font-bebas text-3xl text-[#E63932]">100% FRESH</span>
                <span className="text-xs text-[#B8B8B8] mt-1">
                  Never frozen patties pressed fresh on searing iron griddles.
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#E63932] to-[#b3241e] text-white shadow-xl flex flex-col justify-center">
                <Flame className="w-8 h-8 text-white mb-2" />
                <span className="font-bebas text-3xl tracking-wide">MIAN GUJAR'S #1</span>
                <span className="text-xs text-white/90 mt-1">
                  Peshawar's destination for serious fast-food burger lovers.
                </span>
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#333]">
                <img
                  src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80"
                  alt="Smoked BBQ Monster Burger"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Story & Content */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>ABOUT BURGER BITE</span>
            </div>

            <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none mb-6">
              {settings.aboutTitle || 'CRAFTED WITH OBSESSION, BRED FOR BITE'}
            </h2>

            <p className="text-sm sm:text-base text-[#B8B8B8] leading-relaxed mb-8">
              {settings.aboutText ||
                'Burger Bite was born out of a single, undeniable craving: the quest for the ultimate burger right here in Mian Gujar, Peshawar. We smash our freshly minced 100% Halal beef patties to crispy-edged perfection on a roaring flat-top grill, melt premium aged cheddar over every crevice, and tuck it between lightly toasted buttery brioche buns with our secret house sauces.'}
            </p>

            {/* Core Values checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-8">
              {[
                '100% Halal Certified Prime Beef & Chicken',
                'Handcrafted House Chipotle & Spicy Sauces',
                'Artisan Bakery Brioche Buns Toasted Daily',
                'Hot, Fresh Prep in Clean Hygienic Kitchen',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#E63932] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Numeric Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-[#252525]">
              {(settings.aboutStats && settings.aboutStats.length > 0
                ? settings.aboutStats
                : [
                    { label: 'Happy Bite Lovers', value: '25,000+' },
                    { label: 'Fresh Daily Meat', value: '100% Halal' },
                    { label: 'Customer Rating', value: '4.9 ★' },
                    { label: 'Prep Time', value: '10-15 Min' },
                  ]
              ).map((stat, idx) => (
                <div key={idx} className="bg-[#101010] p-3.5 rounded-xl border border-[#252525]">
                  <span className="font-bebas text-2xl sm:text-3xl text-[#E63932] block leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-[#B8B8B8] font-medium leading-tight block mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
