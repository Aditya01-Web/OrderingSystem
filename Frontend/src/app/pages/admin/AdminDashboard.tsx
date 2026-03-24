import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchAllMenuItems } from '../../services/adminApi';
import { UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const [totalItems,     setTotalItems]     = useState(0);
  const [availableItems, setAvailableItems] = useState(0);
  const [unavailableItems, setUnavailableItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllMenuItems();
        const items = data.menu_items || [];
        setTotalItems(items.length);
        setAvailableItems(items.filter((i: any) => i.availability).length);
        setUnavailableItems(items.filter((i: any) => !i.availability).length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { label: 'Total Menu Items', value: totalItems,       icon: UtensilsCrossed, color: '#3A6B35', bg: '#E8F0E5' },
    { label: 'Available',        value: availableItems,   icon: CheckCircle,     color: '#16a34a', bg: '#dcfce7' },
    { label: 'Unavailable',      value: unavailableItems, icon: XCircle,         color: '#dc2626', bg: '#fee2e2' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
          Welcome back to Coffee Nest Admin
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B7F68' }}>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="p-6 rounded-2xl border flex items-center gap-4"
              style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1C2B1A' }}>{value}</p>
                <p className="text-sm"           style={{ color: '#6B7F68' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};