import { History, Package } from 'lucide-react';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

export const OrderHistoryPage = () => {
  const { orders } = useCart();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; bg: string; color: string; border: string }> = {
      pending: {
        label: 'Pending',
        bg: '#FEF3C7',
        color: '#92400E',
        border: '#FCD34D',
      },
      preparing: {
        label: 'Preparing',
        bg: '#FFF7ED',
        color: '#C2410C',
        border: '#FDBA74',
      },
      ready: {
        label: 'Ready',
        bg: '#D6E9D0',
        color: '#1C4A1A',
        border: '#7EB67A',
      },
      completed: {
        label: 'Completed',
        bg: '#E8F0E5',
        color: '#3A6B35',
        border: '#A8C9A0',
      },
    };

    const info = variants[status] || variants.pending;

    return (
      <span
        className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border"
        style={{ backgroundColor: info.bg, color: info.color, borderColor: info.border }}
      >
        {info.label}
      </span>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED', color: '#1C2B1A' }}>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card
            className="max-w-md mx-auto text-center py-12 border"
            style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
          >
            <CardContent>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#D6E9D0' }}
              >
                <History className="w-10 h-10" style={{ color: '#3A6B35' }} />
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                No order history
              </h2>
              <p className="mb-6" style={{ color: '#6B7F68' }}>
                You haven't placed any orders yet. Start browsing our menu!
              </p>
              <Button
                className="font-bold rounded-xl px-8 hover:opacity-90 transition-all"
                style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
              >
                <a href="/">Browse Menu</a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED', color: '#1C2B1A' }}>
      <Header />

      <main className="container mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#D6E9D0' }}
          >
            <History className="w-5 h-5" style={{ color: '#3A6B35' }} />
          </div>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
          >
            Order History
          </h1>
        </div>
        <div className="w-16 h-[3px] rounded-full mb-8 ml-13" style={{ backgroundColor: '#7EB67A' }} />

        <div className="max-w-4xl mx-auto space-y-4">
          {orders.map((order, index) => (
            <Card
              key={order.id}
              className="border transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#7EB67A';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(58,107,53,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#C8BAA8';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className="text-lg mb-0.5 font-bold"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                    >
                      Order #{orders.length - index}
                    </CardTitle>
                    <p className="text-xs font-mono mb-1" style={{ color: '#6B7F68' }}>
                      {order.id}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7F68' }}>
                      {new Date(order.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>

              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: '#F7F3ED', border: '1px solid #D4CCC0' }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm" style={{ color: '#1C2B1A' }}>
                          {item.name}
                        </h4>
                        <p className="text-xs mt-0.5" style={{ color: '#6B7F68' }}>
                          Qty:{' '}
                          <span className="font-bold" style={{ color: '#3A6B35' }}>
                            {item.quantity}
                          </span>{' '}
                          × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: '#1C2B1A' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator style={{ backgroundColor: '#C8BAA8' }} className="my-4" />

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Customer', value: order.customerName },
                    { label: 'Email', value: order.customerEmail, truncate: true },
                    { label: 'Payment', value: order.paymentMethod.replace('-', ' ') },
                    { label: 'Total', value: `₹${order.total.toFixed(2)}`, highlight: true },
                  ].map(({ label, value, truncate, highlight }) => (
                    <div
                      key={label}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: '#F7F3ED', border: '1px solid #D4CCC0' }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7F68' }}>
                        {label}
                      </p>
                      <p
                        className={`font-bold text-sm capitalize ${truncate ? 'truncate' : ''}`}
                        style={{ color: highlight ? '#3A6B35' : '#1C2B1A', fontSize: highlight ? '16px' : undefined }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card
          className="max-w-4xl mx-auto mt-8 border"
          style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
        >
          <CardHeader>
            <CardTitle
              className="text-xl font-bold"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
            >
              Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Package className="w-7 h-7" style={{ color: '#3A6B35' }} />,
                  value: orders.length,
                  label: 'Total Orders',
                  highlight: false,
                },
                {
                  icon: null,
                  value: orders.filter((o) => o.status === 'completed').length,
                  label: 'Completed',
                  highlight: false,
                },
                {
                  icon: null,
                  value: `₹${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`,
                  label: 'Total Spent',
                  highlight: true,
                },
              ].map(({ icon, value, label, highlight }, i) => (
                <div
                  key={i}
                  className="text-center p-5 rounded-xl"
                  style={{ backgroundColor: '#F7F3ED', border: '1px solid #D4CCC0' }}
                >
                  {icon && <div className="flex justify-center mb-2">{icon}</div>}
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: highlight ? '#3A6B35' : '#1C2B1A' }}
                  >
                    {value}
                  </p>
                  <p className="text-sm" style={{ color: '#6B7F68' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};