import React from 'react';
import { Flame, MapPin, Phone, Clock, Shield, Heart } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigateToAdmin }) => {
  return (
    <footer className="bg-[#101010] border-t border-[#222222] text-[#B8B8B8] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E63932] flex items-center justify-center text-white shadow-lg shadow-[#E63932]/30">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <span className="font-bebas text-3xl text-white tracking-wider">
                BURGER <span className="text-[#E63932]">BITE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#B8B8B8] mb-6">
              Mian Gujar's favorite gourmet fast-food spot. Premium 100% Halal beef smash burgers, fiery crispy chicken, loaded cheesy fries, and thick shakes.
            </p>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-white font-semibold">Kitchen Active: 4 PM – 10 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bebas text-xl text-white tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Full Food Menu
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Our Story & Patties
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Foodies Choose Us
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Food Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Customer Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Delivery & FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Timings */}
          <div>
            <h4 className="font-bebas text-xl text-white tracking-wider mb-4">Location & Hours</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E63932] shrink-0 mt-0.5" />
                <span className="text-white/90">{settings.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E63932] shrink-0 mt-0.5" />
                <span className="text-white/90">{settings.openingHours}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#E63932] shrink-0 mt-0.5" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-white/90 hover:text-[#E63932] transition-colors"
                >
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="font-bebas text-xl text-white tracking-wider mb-4">Staff & Owner</h4>
            <p className="text-xs text-[#888] leading-relaxed mb-4">
              Authorized restaurant operators can login to manage menu items, prices, view live orders, and update operating hours.
            </p>
            <button
              onClick={onNavigateToAdmin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#333] hover:border-[#E63932] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#E63932]" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777]">
          <p>© {new Date().getFullYear()} BURGER BITE. All rights reserved. Mian Gujar, Peshawar.</p>
          <p className="flex items-center gap-1.5">
            Crafted for burger lovers in Peshawar with <Heart className="w-3.5 h-3.5 text-[#E63932] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
