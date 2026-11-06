import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { submitCustomerEnquiry } from '../../services/dbService';

interface Props {
  settings: WebsiteSettings;
}

export const ContactSection: React.FC<Props> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setStatusMessage(null);

    try {
      await submitCustomerEnquiry({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim(),
      });

      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your message has been sent to our team. We will get back to you shortly.',
      });

      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to submit enquiry:', err);
      setStatusMessage({
        type: 'error',
        text: 'Could not send enquiry right now. Please call or WhatsApp us directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#101010] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
                <Phone className="w-3.5 h-3.5" />
                <span>GET IN TOUCH</span>
              </div>
              <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none mb-4">
                CONTACT <span className="text-[#E63932]">BURGER BITE</span>
              </h2>
              <p className="text-sm text-[#B8B8B8] leading-relaxed mb-8">
                Have questions about bulk orders, party deals, or feedback on your meal? Call us directly, send a WhatsApp message, or drop an enquiry below.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#171717] border border-[#252525] hover:border-[#E63932] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-[#E63932] group-hover:scale-105 transition-transform shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888] font-medium block">Phone Order / Call</span>
                    <span className="text-base font-bold text-white group-hover:text-[#E63932] transition-colors">
                      {settings.phone}
                    </span>
                    <span className="text-[11px] text-emerald-400 block mt-0.5 font-medium">Click to call immediately</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                    'Hello Burger Bite! I have an enquiry regarding your menu and orders.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#171717] border border-[#252525] hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888] font-medium block">WhatsApp Chat</span>
                    <span className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {settings.phone}
                    </span>
                    <span className="text-[11px] text-emerald-400 block mt-0.5 font-medium">Instant replies on WhatsApp</span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#171717] border border-[#252525]">
                  <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888] font-medium block">Restaurant Address</span>
                    <span className="text-sm font-semibold text-white">
                      {settings.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#171717] border border-[#252525]">
                  <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-blue-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888] font-medium block">Opening Hours</span>
                    <span className="text-sm font-semibold text-white">
                      {settings.openingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-[#171717] border border-[#252525] rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h3 className="font-bebas text-3xl sm:text-4xl text-white mb-2">
              SEND US A <span className="text-[#E63932]">MESSAGE</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#B8B8B8] mb-8">
              Fill out this quick form and our manager in Mian Gujar will get back to you right away.
            </p>

            {statusMessage && (
              <div
                className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border border-red-500/40 text-red-300'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <p className="text-xs leading-relaxed">{statusMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Shah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0311 9598182"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Your Message or Enquiry *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you'd like to ask or share..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-4 text-xs sm:text-sm text-white placeholder-[#555] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#E63932]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Enquiry to Burger Bite</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
