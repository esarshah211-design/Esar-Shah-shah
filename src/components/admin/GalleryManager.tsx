import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../../types';
import { addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../services/dbService';

interface Props {
  galleryItems: GalleryItem[];
}

export const GalleryManager: React.FC<Props> = ({ galleryItems }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setImageUrl('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80');
    setCaption('');
    setCategory('Burgers');
    setDisplayOrder(galleryItems.length + 1);
    setImageError(null);
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setImageUrl(item.imageUrl);
    setCaption(item.caption);
    setCategory(item.category || '');
    setDisplayOrder(item.displayOrder || 1);
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
      setImageError('Image size exceeds 2MB limit.');
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
    if (!imageUrl.trim()) return;

    setSaving(true);
    try {
      const payload = {
        imageUrl: imageUrl.trim(),
        caption: caption.trim() || 'Burger Bite Food Photography',
        category: category.trim() || undefined,
        displayOrder: Number(displayOrder),
      };

      if (editingItem) {
        await updateGalleryItem(editingItem.id, payload);
      } else {
        await addGalleryItem(payload);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save gallery failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (confirm('Delete this photo from the public gallery?')) {
      try {
        await deleteGalleryItem(item.id);
      } catch (err) {
        console.error('Delete gallery item failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            GALLERY MANAGEMENT
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Upload food photographs, update captions, and organize the customer gallery reel.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photograph</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group bg-[#171717] rounded-2xl border border-[#272727] overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-[#222]">
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 text-white hover:text-[#E63932] transition-colors"
                  title="Edit photo"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 text-white hover:text-red-400 transition-colors"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs font-semibold text-white line-clamp-2">{item.caption}</p>
              {item.category && (
                <span className="text-[10px] uppercase font-bold text-[#E63932] tracking-wider mt-1 block">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2d2d2d] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bebas text-2xl text-white mb-1">
              {editingItem ? 'EDIT PHOTOGRAPH' : 'UPLOAD NEW PHOTOGRAPH'}
            </h3>
            <p className="text-xs text-[#888] mb-6">
              Photos appear on the customer website gallery showcase immediately.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3 bg-[#101010] border border-[#252525] rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Image Source
                </label>

                {imageError && <p className="text-xs text-red-400">{imageError}</p>}

                <div className="flex items-center gap-3">
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
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252525] hover:bg-[#333] text-white text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or enter image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2e2e2e] rounded-xl px-2.5 py-1 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Caption / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sizzling Double Smash Burger with melted cheddar"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Burgers, Fries, Deals"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#252525] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#252525] text-[#888] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
