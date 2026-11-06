import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  HelpCircle,
  Plus,
  Trash2,
  Bike,
  Flame,
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { saveWebsiteSettings } from '../../services/dbService';

interface Props {
  settings: WebsiteSettings;
}

export const ContentManager: React.FC<Props> = ({ settings }) => {
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...(formData.faqItems || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, faqItems: updated }));
  };

  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faqItems: [
        ...(prev.faqItems || []),
        { question: 'New Question?', answer: 'Answer here...' },
      ],
    }));
  };

  const removeFaqItem = (index: number) => {
    const updated = [...(formData.faqItems || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqItems: updated }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await saveWebsiteSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save website settings:', err);
      alert('Failed to update website content. Check console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* Top action sticky bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#171717] p-6 rounded-3xl border border-[#272727] sticky top-24 z-20 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            WEBSITE CONTENT MANAGEMENT
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Update restaurant copy, phone numbers, opening hours, delivery fees, and FAQs without touching code.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          {saving ? (
            <span>Saving Changes...</span>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Section Copy */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#E63932] mb-2">
          <Flame className="w-5 h-5 fill-current" />
          <h3 className="font-bebas text-2xl text-white tracking-wide">Hero Section Content</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Hero Heading (Main Title)
          </label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) => handleChange('heroTitle', e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Hero Subtitle / Description
          </label>
          <textarea
            rows={3}
            value={formData.heroSubtitle}
            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-3 text-xs sm:text-sm text-white outline-none resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Top Accent Pill Badge
          </label>
          <input
            type="text"
            value={formData.heroBadge}
            onChange={(e) => handleChange('heroBadge', e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
          />
        </div>
      </div>

      {/* Business Details & Contact Info */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <Phone className="w-5 h-5" />
          <h3 className="font-bebas text-2xl text-white tracking-wide">
            Location & Contact Settings (Peshawar)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Phone Number (Displayed & Click-to-Call) *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              WhatsApp Order Number (with Country Code) *
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Opening Hours (e.g. 4 PM – 10 PM) *
            </label>
            <input
              type="text"
              required
              value={formData.openingHours}
              onChange={(e) => handleChange('openingHours', e.target.value)}
              className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Physical Location / Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Delivery Configuration */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <Bike className="w-5 h-5" />
          <h3 className="font-bebas text-2xl text-white tracking-wide">Delivery Configuration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="p-4 rounded-xl bg-[#101010] border border-[#252525] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Enable Home Delivery</span>
            <input
              type="checkbox"
              checked={formData.deliveryActive}
              onChange={(e) => handleChange('deliveryActive', e.target.checked)}
              className="w-4 h-4 accent-[#E63932]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Flat Delivery Fee (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={formData.deliveryFee}
              onChange={(e) => handleChange('deliveryFee', Number(e.target.value))}
              className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Free Delivery Above (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={formData.minOrder}
              onChange={(e) => handleChange('minOrder', Number(e.target.value))}
              className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* About Burger Bite Content */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="font-bebas text-2xl text-white tracking-wide">About Section Story</h3>

        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            About Headline
          </label>
          <input
            type="text"
            value={formData.aboutTitle}
            onChange={(e) => handleChange('aboutTitle', e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Story & Mission Text
          </label>
          <textarea
            rows={4}
            value={formData.aboutText}
            onChange={(e) => handleChange('aboutText', e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-3 text-xs sm:text-sm text-white outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* FAQ Management */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-blue-400">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-bebas text-2xl text-white tracking-wide">
              FAQ Content Management
            </h3>
          </div>
          <button
            type="button"
            onClick={addFaqItem}
            className="px-3.5 py-1.5 rounded-lg bg-[#252525] hover:bg-[#333] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {(formData.faqItems || []).map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#101010] border border-[#252525] space-y-3 relative group"
            >
              <button
                type="button"
                onClick={() => removeFaqItem(idx)}
                className="absolute top-4 right-4 text-[#666] hover:text-red-400 p-1 transition-colors"
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#888] mb-1">
                  Question #{idx + 1}
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                  className="w-full bg-[#171717] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2 text-xs text-white outline-none pr-10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#888] mb-1">
                  Answer
                </label>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                  className="w-full bg-[#171717] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
