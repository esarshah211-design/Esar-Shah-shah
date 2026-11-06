import React from 'react';
import { Flame, MessageCircle, ArrowRight, Star, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
  onExploreMenu: () => void;
}

export const Hero: React.FC<Props> = ({ settings, onExploreMenu }) => {
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-[#101010]">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E63932]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#E63932]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#222222] border border-[#333333] text-xs font-bold text-amber-400 mb-6 shadow-inner">
              <Flame className="w-4 h-4 text-[#E63932] fill-current animate-bounce" />
              <span>{settings.heroBadge || '🔥 SIZZLING HOT IN MIAN GUJAR, PESHAWAR'}</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="font-bebas text-5xl sm:text-7xl xl:text-8xl tracking-tight leading-[0.9] text-white uppercase mb-6">
              {settings.heroTitle ? (
                settings.heroTitle.includes('.') ? (
                  <>
                    {settings.heroTitle.split('.')[0]}.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E63932] via-[#ff5a52] to-amber-500">
                      {settings.heroTitle.split('.').slice(1).join('.')}
                    </span>
                  </>
                ) : (
                  settings.heroTitle
                )
              ) : (
                <>
                  BIG FLAVOUR.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E63932] via-[#ff5a52] to-amber-500">
                    BIGGER BITES.
                  </span>
                </>
              )}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#B8B8B8] max-w-xl font-normal leading-relaxed mb-8">
              {settings.heroSubtitle ||
                'Craving something delicious? Explore Burger Bite, your local fast-food destination in Mian Gujar, Peshawar. Discover our food selection and contact us for orders and enquiries.'}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onExploreMenu}
                className="px-8 py-4 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#E63932]/35 transition-all hover:scale-103 active:scale-98 cursor-pointer"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                  'Hello Burger Bite! I would like to explore the menu and order fresh food.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-[#252525] hover:bg-[#2d2d2d] text-white font-bold text-base flex items-center justify-center gap-3 border border-[#383838] shadow-lg transition-all hover:border-emerald-500/50 hover:text-emerald-400 active:scale-98"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#222222] w-full max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center text-[#E63932]">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">100% Halal</p>
                  <p className="text-[10px] text-[#B8B8B8]">Fresh Prime Meat</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">4.9 / 5.0</p>
                  <p className="text-[10px] text-[#B8B8B8]">Peshawar Foodies</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">15-20 Min</p>
                  <p className="text-[10px] text-[#B8B8B8]">Quick Prep Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Burger Hero Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Burger Spotlight Ring */}
            <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-gradient-to-b from-[#222222] to-[#171717] p-4 border border-[#333333] shadow-2xl flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E63932]/25 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                alt="Signature Burger Bite Double Smash Burger"
                className="w-full h-full object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Price Tag */}
              <div className="absolute top-6 right-6 bg-[#101010]/90 backdrop-blur-md border border-[#333333] py-2 px-3.5 rounded-xl shadow-xl flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#B8B8B8] uppercase">From</span>
                <span className="font-bebas text-2xl text-white tracking-wider">Rs 550</span>
              </div>

              {/* Floating Live Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#171717]/95 backdrop-blur-md border border-[#333333] p-3 rounded-xl shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E63932]/20 flex items-center justify-center text-[#E63932]">
                    <Sparkles className="w-5 h-5 fill-[#E63932]/30" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Classic Double Smash</p>
                    <p className="text-[11px] text-[#B8B8B8]">Two patties, cheddar melt & brioche</p>
                  </div>
                </div>
                <button
                  onClick={onExploreMenu}
                  className="px-3 py-1.5 rounded-lg bg-[#E63932] hover:bg-[#c92f29] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
