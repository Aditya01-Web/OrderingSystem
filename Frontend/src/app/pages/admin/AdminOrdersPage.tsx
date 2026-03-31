import { useCart } from '../../context/CartContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ShoppingBag, Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7', icon: Clock      },
  preparing: { label: 'Preparing', color: '#1d4ed8', bg: '#dbeafe', icon: ChefHat    },
  ready:     { label: 'Ready',     color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
  completed: { label: 'Completed', color: '#6B7F68', bg: '#f3f4f6', icon: CheckCircle },
};

export const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useCart();

  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter((o) => o.status === 'pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const readyOrders     = orders.filter((o) => o.status === 'ready').length;

  const stats = [
    { label: 'Total Orders',  value: totalOrders,     icon: ShoppingBag,  color: '#3A6B35', bg: '#E8F0E5' },
    { label: 'Pending',       value: pendingOrders,   icon: Clock,        color: '#b45309', bg: '#fef3c7' },
    { label: 'Preparing',     value: preparingOrders, icon: ChefHat,      color: '#1d4ed8', bg: '#dbeafe' },
    { label: 'Ready',         value: readyOrders,     icon: CheckCircle,  color: '#16a34a', bg: '#dcfce7' },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
        >
          Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats — same style as dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
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

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border"
          style={{ backgroundColor: '#fff', borderColor: '#C8BAA8', color: '#6B7F68' }}
        >
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F7F3ED', borderBottom: '1px solid #C8BAA8' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Date', 'Status', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-4 font-semibold uppercase tracking-wide text-xs"
                      style={{ color: '#6B7F68' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const s = STATUS_CONFIG[order.status];
                  const StatusIcon = s.icon;
                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-[#F7F3ED]"
                      style={{ borderBottom: i < orders.length - 1 ? '1px solid #EDE8E0' : 'none' }}
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4 font-mono text-xs font-bold" style={{ color: '#3A6B35' }}>
                        {order.id}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-semibold" style={{ color: '#1C2B1A' }}>{order.customerName}</p>
                        <p className="text-xs"       style={{ color: '#6B7F68' }}>{order.customerEmail}</p>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4" style={{ color: '#4A5E47' }}>
                        <div className="space-y-0.5">
                          {order.items.map((item) => (
                            <p key={item.id}>
                              {item.name}{' '}
                              <span className="font-bold" style={{ color: '#3A6B35' }}>x{item.quantity}</span>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-bold" style={{ color: '#1C2B1A' }}>
                        ₹{order.total.toFixed(2)}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4 capitalize" style={{ color: '#4A5E47' }}>
                        {order.paymentMethod.replace('-', ' ')}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs" style={{ color: '#6B7F68' }}>
                        {new Date(order.timestamp).toLocaleDateString()}{' '}
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: s.bg, color: s.color }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {s.label}
                        </span>
                      </td>

                      {/* Action — update status */}
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="text-xs rounded-lg px-2 py-1.5 border outline-none cursor-pointer"
                          style={{
                            borderColor: '#C8BAA8',
                            backgroundColor: '#F7F3ED',
                            color: '#1C2B1A',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
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