import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, fetchAllCategories } from '../../services/adminApi';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminMenu = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  const [formData, setFormData] = useState({
    item_name: '',
    price: '',
    category_id: 1,
    availability: true,
    image_url: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, catsData] = await Promise.all([
        fetchAllMenuItems(),
        fetchAllCategories()
      ]);
      setItems(itemsData.menu_items || []);
      
      const newCategoryMap: Record<number, string> = {};
      if (catsData && catsData.categories) {
        catsData.categories.forEach((c: any) => {
          newCategoryMap[c.category_id] = c.category_name;
        });
      }
      setCategoryMap(newCategoryMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setFormData({ item_name: '', price: '', category_id: 1, availability: true, image_url: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name,
      price: item.price,
      category_id: item.category_id,
      availability: item.availability,
      image_url: item.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (modalType === 'add') {
        await addMenuItem({ ...formData, price: Number(formData.price) });
      } else {
        await updateMenuItem(selectedItem.item_id, { ...formData, price: Number(formData.price) });
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save menu item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteMenuItem(itemId);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete menu item.');
    }
  };

  const filtered = items.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
          >
            Menu Items
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
            View all menu items and their availability
          </p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#C8BAA8', backgroundColor: '#F7F3ED', color: '#1C2B1A' }}
          />
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors text-sm"
            style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2E5529')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3A6B35')}
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B7F68' }}>Loading menu...</div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#C8BAA8' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#EDE8E0' }}>
                {['ID', 'Item Name', 'Category', 'Price', 'Status', 'Action'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs"
                    style={{ color: '#4A5E47' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr
                  key={item.item_id}
                  style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#F7F3ED' }}
                >
                  <td className="px-4 py-3" style={{ color: '#6B7F68' }}>{item.item_id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1C2B1A' }}>{item.item_name}</td>
                  <td className="px-4 py-3" style={{ color: '#4A5E47' }}>
                    {categoryMap[item.category_id] ?? 'Other'}
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#3A6B35' }}>
                    ₹{parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: item.availability ? '#dcfce7' : '#fee2e2',
                        color:           item.availability ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {item.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-700 transition-colors" title="Edit Item">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.item_id)} className="p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors" title="Delete Item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: '#6B7F68' }}>
              No items found.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" style={{ backgroundColor: '#F7F3ED' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#1C2B1A' }}>
                {modalType === 'add' ? 'Add New Item' : 'Edit Menu Item'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" style={{ color: '#4A5E47' }} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: '#4A5E47' }}>Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border outline-none bg-white"
                  style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: '#4A5E47' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border outline-none bg-white"
                    style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: '#4A5E47' }}>Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border outline-none bg-white"
                    style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
                  >
                    {Object.entries(categoryMap).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: '#4A5E47' }}>Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-xl border outline-none bg-white"
                  style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availability"
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="availability" className="text-sm font-bold cursor-pointer" style={{ color: '#1C2B1A' }}>
                  Item is available
                </label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-xl font-bold border"
                  style={{ borderColor: '#C8BAA8', color: '#4A5E47' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};