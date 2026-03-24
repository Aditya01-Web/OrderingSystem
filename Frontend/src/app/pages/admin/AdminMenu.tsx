import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchAllMenuItems } from '../../services/adminApi';
import { categoryMap } from '../../services/menuApi';

export const AdminMenu = () => {
  const [items,   setItems]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllMenuItems();
        setItems(data.menu_items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border text-sm outline-none"
          style={{ borderColor: '#C8BAA8', backgroundColor: '#F7F3ED', color: '#1C2B1A' }}
        />
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B7F68' }}>Loading menu...</div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#C8BAA8' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#EDE8E0' }}>
                {['ID', 'Item Name', 'Category', 'Price', 'Status'].map((h) => (
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
    </AdminLayout>
  );
};