import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
}

export const MapSection: React.FC<Props> = ({ settings }) => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Mian Gujar Peshawar Khyber Pakhtunkhwa Pakistan'
  )}`;

  return (
    <section id="location" className="py-20 bg-[#171717] border-y border-[#222222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>FIND OUR SPOT</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
              VISIT US IN <span className="text-[#E63932]">MIAN GUJAR, PESHAWAR</span>
            </h2>
            <p className="text-sm sm:text-base text-[#B8B8B8] max-w-lg mt-2">
              Located conveniently in the heart of Mian Gujar with ample parking and cozy takeaway pickup counters.
            </p>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto px-6 py-3.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Google Maps Directions</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Embedded Map Frame & Info Overlay */}
        <div className="relative rounded-3xl overflow-hidden border border-[#333333] shadow-2xl bg-[#101010]">
          <iframe
            title="Burger Bite Location in Mian Gujar, Peshawar"
            src="https://maps.google.com/maps?q=Mian%20Gujar,%20Peshawar,%20Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="440"
            style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-80 sm:h-96 md:h-[440px]"
          />

          {/* Quick Info Chip */}
          <div className="hidden sm:flex absolute bottom-6 left-6 bg-[#171717]/95 backdrop-blur-md border border-[#333] p-4 rounded-2xl shadow-2xl items-center gap-4 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E63932] flex items-center justify-center text-white shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">BURGER BITE</h4>
              <p className="text-xs text-[#B8B8B8] mt-0.5">{settings.address}</p>
              <p className="text-[11px] text-amber-400 font-semibold mt-1">Open: {settings.openingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
