import React, { useState } from 'react';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types';

interface Props {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<Props> = ({ galleryItems }) => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeItem) return;
    const currentIndex = galleryItems.findIndex((g) => g.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setActiveItem(galleryItems[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeItem) return;
    const currentIndex = galleryItems.findIndex((g) => g.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setActiveItem(galleryItems[nextIndex]);
  };

  return (
    <section id="gallery" className="py-20 bg-[#171717] border-y border-[#222222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>VISUAL FEAST</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
              BURGER BITE <span className="text-[#E63932]">GALLERY</span>
            </h2>
            <p className="text-sm sm:text-base text-[#B8B8B8] max-w-lg mt-2">
              A peek inside our kitchen, sizzling grills, loaded boxes, and craveable moments in Peshawar.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#222222] border border-[#2b2b2b] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || 'Burger Bite Food Photography'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 self-end">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                  {item.caption}
                </p>
                {item.category && (
                  <span className="text-[10px] uppercase font-bold text-[#E63932] tracking-wider mt-1">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full rounded-2xl overflow-hidden border border-[#333] shadow-2xl bg-[#101010] flex items-center justify-center">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.caption}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />

              {/* Navigation arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {activeItem.caption && (
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-white">{activeItem.caption}</p>
                {activeItem.category && (
                  <span className="text-xs text-[#E63932] uppercase font-bold tracking-wider mt-1 inline-block">
                    {activeItem.category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
