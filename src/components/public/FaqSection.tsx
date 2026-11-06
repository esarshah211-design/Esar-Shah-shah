import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
}

export const FaqSection: React.FC<Props> = ({ settings }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems =
    settings.faqItems && settings.faqItems.length > 0
      ? settings.faqItems
      : [
          {
            question: 'What are your opening hours in Mian Gujar, Peshawar?',
            answer: 'We are open every day from 4:00 PM to 10:00 PM. Dine-in, takeaway, and delivery orders are welcomed throughout our operational hours.',
          },
          {
            question: 'How do I place an order for delivery or pickup?',
            answer: 'You can order directly using the shopping cart on this website or click the "Order on WhatsApp" button to send your cart summary directly to +92 311 9598182.',
          },
          {
            question: 'Is all your meat 100% Halal certified?',
            answer: 'Yes, absolutely. All beef and chicken used at Burger Bite are 100% strictly Halal, sourced fresh daily from verified local suppliers in Peshawar.',
          },
          {
            question: 'What payment options do you support?',
            answer: 'We support Cash on Delivery (COD) for home deliveries and cash or direct instant mobile bank transfer (Easypaisa / JazzCash / Bank) at pickup.',
          },
          {
            question: 'Can I customize my burger toppings and spice levels?',
            answer: 'Yes! When adding an item to your cart or placing your order, write any special requests (extra jalapeños, no pickles, extra sauce, mild or spicy) in the order notes.',
          },
        ];

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#171717] border-y border-[#222222] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ANSWERS TO YOUR QUESTIONS</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
            FREQUENTLY ASKED <span className="text-[#E63932]">QUESTIONS</span>
          </h2>
          <p className="text-sm sm:text-base text-[#B8B8B8] mt-3">
            Everything you need to know about our food, timing, location, and ordering process.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#101010] rounded-2xl border border-[#252525] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#222] flex items-center justify-center text-[#B8B8B8] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#E63932]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#B8B8B8] leading-relaxed border-t border-[#1f1f1f] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
