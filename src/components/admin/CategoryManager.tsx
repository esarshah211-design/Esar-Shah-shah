import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree, ArrowUpDown } from 'lucide-react';
import { Category, MenuItem } from '../../types';
import { addCategory, updateCategory, deleteCategory } from '../../services/dbService';

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
}

export const CategoryManager: React.FC<Props> = ({ categories, menuItems }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingCategory(null);
    setName('');
    setDisplayOrder(categories.length + 1);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDisplayOrder(cat.displayOrder || 1);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          slug,
          displayOrder: Number(displayOrder),
        });
      } else {
        await addCategory({
          name: name.trim(),
          slug,
          displayOrder: Number(displayOrder),
        });
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Category save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    const itemsInCat = menuItems.filter(
      (i) => i.category.toLowerCase() === cat.name.toLowerCase()
    ).length;

    if (itemsInCat > 0) {
      alert(
        `Cannot delete "${cat.name}" because it still contains ${itemsInCat} active menu items. Please reassign or delete the items first.`
      );
      return;
    }

    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      try {
        await deleteCategory(cat.id);
      } catch (err) {
        console.error('Delete category failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            CATEGORY MANAGEMENT
          </h2>
          <p className="text-xs text-[#B8B8B8]">
            Organize food offerings into clean navigational sections on the menu.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = menuItems.filter(
            (i) => i.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-[#171717] rounded-2xl p-6 border border-[#272727] flex flex-col justify-between shadow-lg hover:border-[#383838] transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-[#E63932] shrink-0">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-lg bg-[#252525] hover:bg-[#333] text-white transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white mb-1">{cat.name}</h3>
                <div className="flex items-center justify-between text-xs text-[#888]">
                  <span>Slug: {cat.slug || cat.name.toLowerCase()}</span>
                  <span className="font-semibold text-amber-400">{count} items</span>
                </div>
              </div>
            </div>
          );
        })}
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
              {editingCategory ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
            </h3>
            <p className="text-xs text-[#888] mb-6">
              Menu categories will reorder dynamically on the customer website.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gourmet Burgers, Loaded Fries"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
