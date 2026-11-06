import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Sparkles,
  Flame,
  Search,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';
import { MenuItem, Category } from '../../types';
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  toggleMenuItemFeatured,
} from '../../services/dbService';

interface Props {
  menuItems: MenuItem[];
  categories: Category[];
}

export const MenuManager: React.FC<Props> = ({ menuItems, categories }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(550);
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(550);
    setCategory(categories[0]?.name || 'Gourmet Burgers');
    setImageUrl('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');
    setBadge('');
    setIsAvailable(true);
    setIsFeatured(false);
    setImageError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setBadge(item.badge || '');
    setIsAvailable(item.isAvailable);
    setIsFeatured(item.isFeatured);
    setImageError(null);
    setModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Please select a JPG, PNG, or WebP image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size exceeds 2MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category || categories[0]?.name || 'Gourmet Burgers',
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        badge: badge.trim() || undefined,
        isAvailable,
        isFeatured,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
      } else {
        await addMenuItem(payload);
      }

      setModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save menu item. Check console.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}" from the menu?`)) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await toggleMenuItemAvailability(item.id, !item.isAvailable);
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      await toggleMenuItemFeatured(item.id, !item.isFeatured);
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const filteredItems = menuItems.filter((i) => {
    const matchCat = selectedCategory === 'all' || i.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            MENU MANAGEMENT
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Add, update, or pause dishes. Changes appear immediately on the public website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#171717] p-4 rounded-2xl border border-[#272727]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#101010] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] outline-none focus:border-[#E63932]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#E63932] text-white'
                : 'bg-[#101010] text-[#888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            All ({menuItems.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === c.name
                  ? 'bg-[#E63932] text-white'
                  : 'bg-[#101010] text-[#888] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#252525] bg-[#1a1a1a] text-[#888] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 pl-4">Dish</th>
                <th className="py-3.5">Category</th>
                <th className="py-3.5">Price (PKR)</th>
                <th className="py-3.5">Availability</th>
                <th className="py-3.5">Featured</th>
                <th className="py-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="py-3.5 pl-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#333] shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-[#E63932]/20 text-[#E63932] px-2 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#888] line-clamp-1 max-w-sm mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#CCC] font-medium">{item.category}</td>
                  <td className="py-3.5 font-bold text-white text-sm">
                    Rs {item.price.toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        item.isFeatured
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-[#555] hover:text-white'
                      }`}
                      title={item.isFeatured ? 'Featured on home' : 'Click to feature'}
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3.5 text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg bg-[#252525] hover:bg-[#333] text-white transition-colors cursor-pointer"
                        title="Edit dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 transition-colors cursor-pointer"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Item */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2d2d2d] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bebas text-2xl sm:text-3xl text-white mb-1">
              {editingItem ? 'EDIT MENU ITEM' : 'ADD NEW MENU ITEM'}
            </h3>
            <p className="text-xs text-[#888] mb-6">
              Updates will instantly synchronize to the customer-facing food menu.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Double Smash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Price in PKR *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 680"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Special Highlight Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Spicy, Chef Special"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Ingredients & Taste Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Fresh prime patties, melted cheddar, sweet onions, pickles and secret sauce..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Image Upload / URL */}
              <div className="p-4 rounded-2xl bg-[#101010] border border-[#252525] space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Dish Photograph
                </label>

                {imageError && (
                  <p className="text-xs text-red-400">{imageError}</p>
                )}

                <div className="flex items-center gap-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-[#333] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#222] border border-[#333] flex items-center justify-center text-[#666] shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#252525] hover:bg-[#333] text-white text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File (JPG, PNG, WebP)</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or enter web image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2e2e2e] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E63932] accent-[#E63932]"
                  />
                  <span>Available to Order</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E63932] accent-[#E63932]"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-[#252525] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#252525] text-[#888] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all cursor-pointer"
                >
                  {saving ? 'Saving Changes...' : editingItem ? 'Update Dish' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
