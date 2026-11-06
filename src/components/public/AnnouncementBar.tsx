import React from 'react';
import { Clock, MapPin, Phone, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
}

export const AnnouncementBar: React.FC<Props> = ({ settings }) => {
  return (
    <div className="bg-[#171717] border-b border-[#252525] text-xs text-[#B8B8B8] py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-white">OPEN TODAY:</span>
            <span>{settings.openingHours || '4:00 PM – 10:00 PM'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[#B8B8B8]">
            <MapPin className="w-3.5 h-3.5 text-[#E63932]" />
            <span>Mian Gujar, Peshawar</span>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Free Delivery on Orders over Rs 1,500</span>
          </div>
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 text-white hover:text-[#E63932] transition-colors font-medium"
          >
            <Phone className="w-3 h-3 text-[#E63932]" />
            <span>{settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
