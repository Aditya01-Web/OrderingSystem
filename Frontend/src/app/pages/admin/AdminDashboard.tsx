import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchDashboardData, fetchOrders } from '../../services/adminApi';
import { UtensilsCrossed, CheckCircle, IndianRupee, TrendingUp, Clock, AlertTriangle, ChevronRight, Download, ShoppingBag } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#3A6B35', '#7EB67A', '#C8BAA8', '#D4CCC0', '#E8E2D9'];

export const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async (params?: { period?: string; from_date?: string; to_date?: string }) => {
    if (data) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const [dashboardResponse, ordersResponse] = await Promise.all([
        fetchDashboardData(params),
        fetchOrders().catch(() => [])
      ]);
      setData(dashboardResponse);
      setOrders(ordersResponse);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom') {
      const params = period !== 'all' ? { period } : undefined;
      load(params);
    } else if (fromDate && toDate) {
      load({ from_date: fromDate, to_date: toDate });
    }
  }, [period, fromDate, toDate]);

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

  const filterOrdersByPeriod = (ordersList: any[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return ordersList.filter(order => {
      if (!order.created_at) return false;
      const orderDate = new Date(order.created_at);
      
      if (period === 'today') {
        return orderDate >= todayStart;
      } else if (period === 'weekly') {
        return orderDate >= sevenDaysAgo;
      } else if (period === 'monthly') {
        return orderDate >= thirtyDaysAgo;
      } else if (period === 'custom' && fromDate && toDate) {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }
      return true; // 'all'
    });
  };

  const getSoldItemsBreakdown = () => {
    const filteredOrders = filterOrdersByPeriod(orders);
    const itemMap: Record<string, { quantity: number; price: number; revenue: number }> = {};
    
    filteredOrders.forEach(order => {
      (order.items || []).forEach((item: any) => {
        const name = item.item_details?.item_name || 'Unknown Item';
        const qty = item.quantity || 0;
        const price = parseFloat(item.item_details?.price || '0');
        
        if (!itemMap[name]) {
          itemMap[name] = { quantity: 0, price, revenue: 0 };
        }
        itemMap[name].quantity += qty;
        itemMap[name].revenue += qty * price;
      });
    });

    return Object.entries(itemMap)
      .map(([name, details]) => ({
        name,
        quantity: details.quantity,
        price: details.price,
        revenue: details.revenue
      }))
      .sort((a, b) => b.quantity - a.quantity);
  };

  const soldItemsBreakdown = getSoldItemsBreakdown();
  const filteredBreakdown = soldItemsBreakdown.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = (data: any) => {
    if (!data) return;
    const rows = [];
    
    // Section 1: Basic Metrics
    rows.push(["METRIC", "VALUE"]);
    rows.push(["Daily Revenue", `INR ${data.basic_metrics.daily_revenue}`]);
    rows.push(["Monthly Revenue", `INR ${data.basic_metrics.monthly_revenue}`]);
    rows.push(["Avg Order Value", `INR ${data.basic_metrics.average_order_value}`]);
    rows.push(["Orders Today", data.basic_metrics.total_orders_today]);
    rows.push(["Total Items Sold", data.basic_metrics.total_items_sold || 0]);
    rows.push([]);

    // Section 2: Order Status Breakdown
    rows.push(["ORDER STATUS", "COUNT"]);
    Object.entries(data.order_status_breakdown || {}).forEach(([status, count]) => {
      rows.push([status, count]);
    });
    rows.push([]);

    // Section 3: Top Selling Items
    rows.push(["TOP SELLING ITEM", "QUANTITY SOLD"]);
    (data.predictive_analytics?.top_selling_items || []).forEach((item: any) => {
      rows.push([item.item_name, item.total_quantity]);
    });
    rows.push([]);

    // Section 4: Items Needing Attention
    rows.push(["ITEM NEEDING ATTENTION", "QUANTITY SOLD"]);
    (data.predictive_analytics?.low_performing_items || []).forEach((item: any) => {
      rows.push([item.item_name, item.total_quantity]);
    });
    rows.push([]);

    // Section 5: Table-wise Sales
    rows.push(["TABLE NUMBER", "TOTAL SALES (INR)"]);
    (data.table_analytics?.table_wise_sales || []).forEach((table: any) => {
      rows.push([`Table ${table.table_number}`, table.total_sales]);
    });
    rows.push([]);

    // Section 6: Recent Activity
    rows.push(["ORDER ID", "TABLE NUMBER", "TIME", "AMOUNT (INR)", "STATUS"]);
    (data.recent_activity || []).forEach((order: any) => {
      rows.push([
        `#${order.order_id}`,
        `Table ${order.table_number}`,
        new Date(order.time).toLocaleString(),
        order.total_amount,
        order.status
      ]);
    });

    const csvContent = rows
      .map(row => 
        row.map(val => {
          const str = val === undefined || val === null ? "" : String(val);
          // Escape quotes and wrap in quotes if contains comma, quote or newline
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { label: 'Daily Revenue', value: `₹${basic_metrics.daily_revenue}`, icon: IndianRupee, color: '#3A6B35', bg: '#E8F0E5' },
    { label: 'Monthly Revenue', value: `₹${basic_metrics.monthly_revenue}`, icon: TrendingUp, color: '#16a34a', bg: '#dcfce7' },
    { label: 'Avg Order Value', value: `₹${basic_metrics.average_order_value}`, icon: UtensilsCrossed, color: '#B45309', bg: '#FEF3C7' },
    { label: 'Orders Today', value: basic_metrics.total_orders_today, icon: CheckCircle, color: '#1D4ED8', bg: '#DBEAFE' },
    { label: 'Total Items Sold', value: basic_metrics.total_items_sold || 0, icon: ShoppingBag, color: '#9333EA', bg: '#F3E8FF' },
  ];

  const pieData = Object.keys(order_status_breakdown).map((key) => ({
    name: key,
    value: order_status_breakdown[key]
  }));

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
            >
              Analytics Dashboard
            </h1>
            {refreshing && (
              <span className="text-xs px-2.5 py-1 rounded-full animate-pulse font-medium bg-[#E8F0E5] text-[#3A6B35]">
                Refreshing...
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
            Comprehensive overview of cafeteria performance
          </p>
        </div>

        {/* Filter Controls & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Select */}
          <div className="flex items-center gap-2">
            <label htmlFor="period-select" className="text-xs font-semibold uppercase tracking-wider text-[#6B7F68]">Period:</label>
            <select
              id="period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B35] transition-all"
              style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Pickers */}
          {period === 'custom' && (
            <div className="flex items-center gap-2 transition-all duration-300">
              <input
                type="date"
                aria-label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B35]"
                style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
              />
              <span className="text-xs text-[#6B7F68] font-bold">to</span>
              <input
                type="date"
                aria-label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B35]"
                style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
              />
            </div>
          )}

          {/* Export CSV Button */}
          <button
            onClick={() => exportToCSV(data)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3A6B35] hover:bg-[#2e562a] text-white rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => {
          const isTotalItemsSold = label === 'Total Items Sold';
          return (
            <div
              key={label}
              onClick={isTotalItemsSold ? () => setIsModalOpen(true) : undefined}
              className={`p-6 rounded-2xl border flex items-center gap-4 shadow-sm transition-all duration-200 ${
                isTotalItemsSold ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]' : ''
              }`}
              style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold truncate" style={{ color: '#1C2B1A' }}>{value}</p>
                <p className="text-sm" style={{ color: '#6B7F68' }}>{label}</p>
                {isTotalItemsSold && (
                  <span className="text-[10px] font-bold underline mt-0.5 block animate-pulse" style={{ color: '#9333EA' }}>
                    Click to view breakdown
                  </span>
                )}
              </div>
            </div>
          );
        })}
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

      {/* Modal for Sold Items Breakdown */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl border shadow-xl flex flex-col max-h-[85vh]"
            style={{ borderColor: '#C8BAA8' }}
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#E8E2D9' }}>
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>
                  Items Sold Breakdown ({period === 'all' ? 'All Time' : period === 'today' ? 'Today' : period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'Custom Range'})
                </h3>
                <p className="text-xs mt-1" style={{ color: '#6B7F68' }}>
                  Detailed breakdown of items sold for the selected period
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b bg-[#F7F3ED]/50" style={{ borderColor: '#E8E2D9' }}>
              <input
                type="text"
                placeholder="Search sold items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6B35] transition-all"
                style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredBreakdown.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No items sold matching your search or period
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#E8E2D9' }}>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-[#6B7F68]">Item Name</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-[#6B7F68] text-right">Price</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-[#6B7F68] text-center">Qty Sold</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-[#6B7F68] text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE8E0]">
                      {filteredBreakdown.map((item: any) => (
                        <tr key={item.name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 font-medium text-[#1C2B1A]">{item.name}</td>
                          <td className="py-4 text-right text-[#6B7F68]">₹{item.price.toFixed(2)}</td>
                          <td className="py-4 text-center font-bold text-[#1C2B1A]">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#9333EA]">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="py-4 text-right font-bold text-[#3A6B35]">₹{item.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-[#F7F3ED]/30 flex justify-between items-center text-sm" style={{ borderColor: '#E8E2D9' }}>
              <span className="font-semibold" style={{ color: '#6B7F68' }}>Total Unique Items: {filteredBreakdown.length}</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#3A6B35] hover:bg-[#2e562a] text-white rounded-xl font-semibold shadow-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};