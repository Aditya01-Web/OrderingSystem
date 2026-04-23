import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ShoppingBag, Clock, ChefHat, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchOrders, updateOrderStatus, updateTableStatus } from '../../services/adminApi';

const STATUS_CONFIG: Record<string, any> = {
  Placed:   { label: 'Placed',   color: '#b45309', bg: '#fef3c7', icon: Clock      },
  Preparing: { label: 'Preparing', color: '#1d4ed8', bg: '#dbeafe', icon: ChefHat    },
  Completed: { label: 'Completed', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
};

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      // Sort logic: Placed -> Preparing -> Completed
      const statusOrder: Record<string, number> = { Placed: 1, Preparing: 2, Completed: 3 };
      data.sort((a: any, b: any) => {
        const priorityA = statusOrder[a.order_status] || 99;
        const priorityB = statusOrder[b.order_status] || 99;
        return priorityA - priorityB;
      });
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optimistic update
      setOrders((prev) => {
        const newOrders = prev.map((o) => (o.order_id === orderId ? { ...o, order_status: newStatus } : o));
        const statusOrder: Record<string, number> = { Placed: 1, Preparing: 2, Completed: 3 };
        return [...newOrders].sort((a: any, b: any) => {
          const priorityA = statusOrder[a.order_status] || 99;
          const priorityB = statusOrder[b.order_status] || 99;
          return priorityA - priorityB;
        });
      });
    } catch (error) {
      console.error('Failed to update order status', error);
      alert('Failed to update order status');
    }
  };

  const handleTableStatusChange = async (tableId: number, newStatus: string, orderId: number) => {
    try {
      await updateTableStatus(tableId, newStatus);
      // Optimistic update within the specific order's table object
      setOrders((prev) =>
        prev.map((o) => {
          // Because multiple orders could be associated with the same table,
          // update the table status for all matching orders locally
          if (o.table?.table_id === tableId) {
            return { ...o, table: { ...o.table, status: newStatus } };
          }
          return o;
        })
      );
    } catch (error) {
      console.error('Failed to update table status', error);
      alert('Failed to update table status');
    }
  };

  const totalOrders     = orders.length;
  const placedOrders   = orders.filter((o) => o.order_status === 'Placed').length;
  const preparingOrders = orders.filter((o) => o.order_status === 'Preparing').length;
  const completedOrders = orders.filter((o) => o.order_status === 'Completed').length;

  const stats = [
    { label: 'Total Orders',  value: totalOrders,     icon: ShoppingBag,  color: '#3A6B35', bg: '#E8F0E5' },
    { label: 'Placed',        value: placedOrders,    icon: Clock,        color: '#b45309', bg: '#fef3c7' },
    { label: 'Preparing',     value: preparingOrders, icon: ChefHat,      color: '#1d4ed8', bg: '#dbeafe' },
    { label: 'Completed',     value: completedOrders, icon: CheckCircle,  color: '#16a34a', bg: '#dcfce7' },
  ];

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}>
          Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
          Manage and track all customer orders
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="p-6 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#1C2B1A' }}>{value}</p>
              <p className="text-sm" style={{ color: '#6B7F68' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#A8C9A0', borderTopColor: '#3A6B35' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8', color: '#6B7F68' }}>
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F7F3ED', borderBottom: '1px solid #C8BAA8' }}>
                  {['Order ID', 'Customer', 'Table', 'Total', 'Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold uppercase tracking-wide text-xs" style={{ color: '#6B7F68' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const s = STATUS_CONFIG[order.order_status] || { label: order.order_status, color: '#000', bg: '#eee', icon: Clock };
                  const StatusIcon = s.icon;
                  const isExpanded = expandedOrderId === order.order_id;
                  
                  return (
                    <React.Fragment key={order.order_id}>
                      <tr className="transition-colors hover:bg-[#F7F3ED]" style={{ borderBottom: isExpanded ? 'none' : (i < orders.length - 1 ? '1px solid #EDE8E0' : 'none') }}>
                        {/* Order ID - Clickable */}
                        <td className="px-5 py-4 font-mono text-xs font-bold cursor-pointer hover:underline" style={{ color: '#3A6B35' }} onClick={() => toggleExpand(order.order_id)}>
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            #{order.order_id}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold" style={{ color: '#1C2B1A' }}>{order.customer?.name}</p>
                          <p className="text-xs" style={{ color: '#6B7F68' }}>{order.customer?.contact_number}</p>
                        </td>

                        <td className="px-5 py-4" style={{ color: '#4A5E47' }}>
                          <span className="font-bold">T{order.table?.table_number}</span>
                        </td>

                        <td className="px-5 py-4 font-bold" style={{ color: '#1C2B1A' }}>
                          ₹{parseFloat(order.total_amount).toFixed(2)}
                        </td>

                        <td className="px-5 py-4 text-xs" style={{ color: '#6B7F68' }}>
                          {new Date(order.created_at).toLocaleDateString()}{' '}
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
                            <StatusIcon className="w-3 h-3" />
                            {s.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleOrderStatusChange(order.order_id, e.target.value)}
                            className="text-xs rounded-lg px-2 py-1.5 border outline-none cursor-pointer"
                            style={{ borderColor: '#C8BAA8', backgroundColor: '#F7F3ED', color: '#1C2B1A' }}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                      
                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr style={{ borderBottom: i < orders.length - 1 ? '1px solid #EDE8E0' : 'none' }}>
                          <td colSpan={7} className="px-5 pb-6 pt-2 bg-[#F7F3ED]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-[#C8BAA8]">
                              
                              {/* Order Items List */}
                              <div>
                                <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-[#6B7F68]">Order Items</h4>
                                <ul className="space-y-2">
                                  {order.items?.map((item: any) => (
                                    <li key={item.order_item_id} className="flex justify-between text-sm items-center border-b border-gray-100 pb-2">
                                      <div className="flex flex-col">
                                        <span className="font-semibold text-[#1C2B1A]">{item.item_details?.item_name}</span>
                                        <span className="text-xs text-[#6B7F68]">₹{item.item_details?.price} x {item.quantity}</span>
                                      </div>
                                      <span className="font-bold text-[#3A6B35]">₹{(item.item_details?.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-4 flex justify-between font-bold text-lg text-[#1C2B1A]">
                                  <span>Total Amount:</span>
                                  <span className="text-[#3A6B35]">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Table Status Section */}
                              <div>
                                <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-[#6B7F68]">Table Management</h4>
                                <div className="p-4 bg-[#F7F3ED] rounded-lg border border-[#C8BAA8]">
                                  <p className="text-sm font-semibold mb-2 text-[#1C2B1A]">Table {order.table?.table_number}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-[#6B7F68]">Current Status:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.table?.status === 'Free' ? 'bg-[#E8F0E5] text-[#3A6B35]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
                                      {order.table?.status}
                                    </span>
                                  </div>
                                  <div className="mt-4">
                                    <label className="text-xs font-medium text-[#4A5E47] block mb-1">Update Table Status:</label>
                                    <select
                                      value={order.table?.status}
                                      onChange={(e) => handleTableStatusChange(order.table?.table_id, e.target.value, order.order_id)}
                                      className="text-sm rounded-lg px-3 py-2 border outline-none cursor-pointer w-full"
                                      style={{ borderColor: '#C8BAA8', backgroundColor: '#fff', color: '#1C2B1A' }}
                                    >
                                      <option value="Free">Free</option>
                                      <option value="Occupied">Occupied</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};