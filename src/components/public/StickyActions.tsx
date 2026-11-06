import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
}

export const StickyActions: React.FC<Props> = ({ settings }) => {
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhoneNumber = settings.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 items-end">
      {/* Call button */}
      <a
        href={`tel:${cleanPhoneNumber}`}
        className="w-12 h-12 rounded-full bg-[#1e1e1e] hover:bg-[#282828] text-white border border-[#3a3a3a] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        title="Call Burger Bite (+92 311 9598182)"
        aria-label="Call Burger Bite"
      >
        <Phone className="w-5 h-5 text-white group-hover:text-[#E63932] transition-colors" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
          'Hi Burger Bite! I would like to order fresh food from your Mian Gujar branch.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold text-xs group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">Order on WhatsApp</span>
      </a>
    </div>
  );
};
