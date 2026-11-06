import React, { useState } from 'react';
import {
  Flame,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  MessageCircle,
  Shield,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { WebsiteSettings } from '../../types';

interface Props {
  settings: WebsiteSettings;
  onNavigateToAdmin: () => void;
}

export const Navbar: React.FC<Props> = ({ settings, onNavigateToAdmin }) => {
  const { totalItemsCount, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Location', href: '#location' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-[#101010]/95 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E63932] to-[#b3241e] flex items-center justify-center shadow-lg shadow-[#E63932]/25 group-hover:scale-105 transition-transform">
            <Flame className="w-7 h-7 text-white fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-3xl sm:text-4xl tracking-wider text-white leading-none">
              BURGER <span className="text-[#E63932]">BITE</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8B8B8] -mt-0.5">
              Mian Gujar • Peshawar
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-semibold text-[#B8B8B8] hover:text-white transition-colors cursor-pointer py-1"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Order on WhatsApp */}
          <a
            href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
              'Hi Burger Bite! I would like to explore the menu and place an order.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#252525] hover:bg-[#2e2e2e] text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all hover:scale-102"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
            <span className="hidden xl:inline">WhatsApp Order</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-sm shadow-lg shadow-[#E63932]/30 transition-all hover:scale-102 cursor-pointer active:scale-95"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#E63932] text-xs font-black flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Admin shortcut */}
          <button
            onClick={onNavigateToAdmin}
            className="p-2.5 rounded-xl text-[#B8B8B8] hover:text-white hover:bg-[#222222] transition-colors cursor-pointer"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <Shield className="w-5 h-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#B8B8B8] hover:text-white hover:bg-[#222222] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#171717] border-b border-[#252525] px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-[#B8B8B8] hover:text-white hover:bg-[#222222] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#252525] flex flex-col gap-3">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                'Hi Burger Bite! I would like to place an order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Order on WhatsApp (+92 311 9598182)
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#252525] text-[#B8B8B8] hover:text-white font-medium text-xs border border-[#333333]"
            >
              <Shield className="w-4 h-4 text-[#E63932]" />
              Staff / Owner Admin Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
