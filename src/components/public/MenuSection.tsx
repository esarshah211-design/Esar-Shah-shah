import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Flame,
  Check,
  Sparkles,
  SlidersHorizontal,
  X,
  ShoppingBag,
} from 'lucide-react';
import { MenuItem, Category } from '../../types';
import { useCart } from '../../context/CartContext';

interface Props {
  menuItems: MenuItem[];
  categories: Category[];
}

export const MenuSection: React.FC<Props> = ({ menuItems, categories }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [customQuantity, setCustomQuantity] = useState<number>(1);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    addToCart(item, 1);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  const openCustomizeModal = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCustomizingItem(item);
    setCustomInstructions('');
    setCustomQuantity(1);
  };

  const handleConfirmCustomize = () => {
    if (customizingItem) {
      addToCart(customizingItem, customQuantity, customInstructions);
      setCustomizingItem(null);
    }
  };

  return (
    <section id="menu" className="py-20 bg-[#101010] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63932]/10 border border-[#E63932]/30 text-xs font-bold text-[#E63932] mb-3">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>FRESHLY PREPARED MENU</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
              OUR SIZZLING <span className="text-[#E63932]">SELECTION</span>
            </h2>
            <p className="text-sm sm:text-base text-[#B8B8B8] max-w-lg mt-2">
              Every burger is smashed to order with 100% Halal beef, caramelized onions, melted cheddar, and secret house sauces.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#B8B8B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search burgers, fries, shakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-[#252525] focus:border-[#E63932] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-[#777] outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#E63932] text-white shadow-lg shadow-[#E63932]/30 scale-102'
                : 'bg-[#171717] text-[#B8B8B8] hover:text-white hover:bg-[#222222] border border-[#222222]'
            }`}
          >
            All Items ({menuItems.length})
          </button>

          {categories.map((cat) => {
            const count = menuItems.filter(
              (i) => i.category.toLowerCase() === cat.name.toLowerCase()
            ).length;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E63932] text-white shadow-lg shadow-[#E63932]/30 scale-102'
                    : 'bg-[#171717] text-[#B8B8B8] hover:text-white hover:bg-[#222222] border border-[#222222]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-[#171717] rounded-3xl border border-[#252525] p-8">
            <ShoppingBag className="w-12 h-12 text-[#444] mx-auto mb-4" />
            <h3 className="font-bebas text-2xl text-white">No Items Found</h3>
            <p className="text-sm text-[#B8B8B8] mt-1 max-w-md mx-auto">
              We couldn't find anything matching your filter. Try searching for something else or reset the category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#252525] hover:bg-[#333] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => openCustomizeModal(item)}
                className={`group bg-[#171717] rounded-2xl border border-[#252525] hover:border-[#383838] transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#E63932]/10 cursor-pointer ${
                  !item.isAvailable ? 'opacity-65' : ''
                }`}
              >
                {/* Food Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#222222]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-black/30" />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-[#E63932] text-white text-[11px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{item.badge}</span>
                    </div>
                  )}

                  {/* Status Indicator */}
                  {!item.isAvailable && (
                    <div className="absolute top-3 right-3 bg-red-950/90 text-red-300 border border-red-700/50 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg backdrop-blur-sm">
                      Sold Out
                    </div>
                  )}

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3 bg-[#101010]/90 backdrop-blur-md border border-[#333333] py-1.5 px-3 rounded-xl shadow-lg">
                    <span className="font-bebas text-xl sm:text-2xl text-white tracking-wider">
                      Rs {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E63932]">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-[#E63932] transition-colors leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#B8B8B8] line-clamp-2 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-[#222222] flex items-center justify-between gap-3">
                    <span className="text-xs text-[#888] font-medium group-hover:text-[#aaa] transition-colors">
                      {item.isAvailable ? 'Click to customize' : 'Temporarily unavailable'}
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      disabled={!item.isAvailable}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        addedItemId === item.id
                          ? 'bg-emerald-600 text-white'
                          : item.isAvailable
                          ? 'bg-[#252525] hover:bg-[#E63932] text-white border border-[#333] hover:border-[#E63932]'
                          : 'bg-[#222] text-[#666] cursor-not-allowed border border-[#2a2a2a]'
                      }`}
                      title={item.isAvailable ? 'Quick Add to Cart' : 'Item Sold Out'}
                    >
                      {addedItemId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Customizer Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2d2d2d] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Image */}
            <div className="relative aspect-video w-full bg-[#222]">
              <img
                src={customizingItem.imageUrl}
                alt={customizingItem.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCustomizingItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E63932]">
                    {customizingItem.category}
                  </span>
                  <h3 className="font-bold text-xl text-white mt-0.5">{customizingItem.name}</h3>
                </div>
                <div className="font-bebas text-2xl text-white whitespace-nowrap">
                  Rs {(customizingItem.price * customQuantity).toLocaleString()}
                </div>
              </div>

              <p className="text-xs text-[#B8B8B8] leading-relaxed mb-6">
                {customizingItem.description}
              </p>

              {/* Special Instructions / Notes */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-white mb-2">
                  Special Cooking Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Extra spicy, no pickles, sauce on side..."
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-3 text-xs text-white placeholder-[#666] outline-none resize-none"
                />
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#252525]">
                <div className="flex items-center gap-3 bg-[#101010] border border-[#252525] rounded-xl p-1">
                  <button
                    onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-[#222] hover:bg-[#333] text-white font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-white text-sm px-2">{customQuantity}</span>
                  <button
                    onClick={() => setCustomQuantity(customQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#222] hover:bg-[#333] text-white font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleConfirmCustomize}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order • Rs {(customizingItem.price * customQuantity).toLocaleString()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
