import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchDashboardData } from '../../services/adminApi';
import { UtensilsCrossed, CheckCircle, IndianRupee, TrendingUp, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#3A6B35', '#7EB67A', '#C8BAA8', '#D4CCC0', '#E8E2D9'];

export const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchDashboardData();
        setData(response);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-xl" style={{ color: '#6B7F68' }}>Loading Dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="text-xl text-red-500 font-bold">{error || 'No dashboard data available'}</div>
          <p className="text-sm text-gray-500">Please check your API endpoint or backend server connection.</p>
        </div>
      </AdminLayout>
    );
  }

  const {
    basic_metrics,
    order_status_breakdown,
    predictive_analytics,
    table_analytics,
    recent_activity
  } = data;

  const stats = [
    { label: 'Daily Revenue', value: `₹${basic_metrics.daily_revenue}`, icon: IndianRupee, color: '#3A6B35', bg: '#E8F0E5' },
    { label: 'Monthly Revenue', value: `₹${basic_metrics.monthly_revenue}`, icon: TrendingUp, color: '#16a34a', bg: '#dcfce7' },
    { label: 'Avg Order Value', value: `₹${basic_metrics.average_order_value}`, icon: UtensilsCrossed, color: '#B45309', bg: '#FEF3C7' },
    { label: 'Orders Today', value: basic_metrics.total_orders_today, icon: CheckCircle, color: '#1D4ED8', bg: '#DBEAFE' },
  ];

  const pieData = Object.keys(order_status_breakdown).map((key) => ({
    name: key,
    value: order_status_breakdown[key]
  }));

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
        >
          Analytics Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
          Comprehensive overview of cafeteria performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="p-6 rounded-2xl border flex items-center gap-4 shadow-sm"
            style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold truncate" style={{ color: '#1C2B1A' }}>{value}</p>
              <p className="text-sm" style={{ color: '#6B7F68' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Order Status Pie Chart */}
        <div className="p-6 rounded-2xl border shadow-sm col-span-1" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <h3 className="font-bold text-lg mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>Order Status Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span style={{ color: '#6B7F68' }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Ordering Hours */}
        <div className="p-6 rounded-2xl border shadow-sm col-span-1 lg:col-span-2" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>
            <Clock className="w-5 h-5 text-blue-600" />
            Peak Ordering Hours
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictive_analytics.peak_ordering_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F7F3ED' }} />
                <Bar dataKey="order_count" fill="#3A6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Top Selling Items */}
        <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Selling Items
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictive_analytics.top_selling_items} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E2D9" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="item_name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip cursor={{ fill: '#F7F3ED' }} />
                <Bar dataKey="total_quantity" fill="#7EB67A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Performing Items */}
        <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Items Needing Attention
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictive_analytics.low_performing_items} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E2D9" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="item_name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip cursor={{ fill: '#F7F3ED' }} />
                <Bar dataKey="total_quantity" fill="#D4CCC0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Sales */}
        <div className="p-6 rounded-2xl border shadow-sm col-span-1 lg:col-span-2" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <h3 className="font-bold text-lg mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>Table-wise Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={table_analytics.table_wise_sales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D9" />
                <XAxis dataKey="table_number" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total_sales" stroke="#3A6B35" strokeWidth={3} dot={{ r: 4, fill: '#3A6B35' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-6 rounded-2xl border shadow-sm col-span-1 overflow-hidden flex flex-col" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <h3 className="font-bold text-lg mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>Recent Activity Feed</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {recent_activity.map((order: any) => (
              <div key={order.order_id} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: '#F7F3ED', borderColor: '#E8E2D9' }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1C2B1A' }}>Order #{order.order_id}</p>
                  <p className="text-xs" style={{ color: '#6B7F68' }}>Table {order.table_number} • {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: '#3A6B35' }}>₹{order.total_amount}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {recent_activity.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: '#6B7F68' }}>No recent activity</p>
            )}
          </div>
        </div>
        
      </div>
    </AdminLayout>
  );
};