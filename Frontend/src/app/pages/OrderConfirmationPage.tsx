import { CheckCircle, Home, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { orders } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState(orders.find((o) => o.id === orderId));

  useEffect(() => {
    const foundOrder = orders.find((o) => o.id === orderId);
    setOrder(foundOrder);
  }, [orders, orderId]);

  if (!order) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED', color: '#1C2B1A' }}>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card
            className="max-w-md mx-auto text-center py-12 border"
            style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
          >
            <CardContent>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                Order not found
              </h2>
              <p className="mb-6" style={{ color: '#6B7F68' }}>
                We couldn't find this order.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="font-bold rounded-xl px-8 hover:opacity-90 transition-all"
                style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
              >
                Back to Home
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
        <div className="max-w-2xl mx-auto">

          {/* Success Banner */}
          <Card
            className="mb-6 border text-center overflow-hidden"
            style={{ backgroundColor: '#EDE8E0', borderColor: '#7EB67A' }}
          >
            {/* Green top stripe */}
            <div className="h-2 w-full" style={{ backgroundColor: '#3A6B35' }} />

            <CardContent className="pt-8 pb-8">
              {/* Animated check circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: '#D6E9D0' }}
              >
                <CheckCircle className="w-11 h-11" style={{ color: '#3A6B35' }} />
              </div>

              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                Order Confirmed!
              </h1>

              <p className="text-lg mb-3" style={{ color: '#4A5E47' }}>
                Thank you for your order,{' '}
                <span className="font-bold" style={{ color: '#3A6B35' }}>
                  {order.customerName}
                </span>
                !
              </p>

              <p className="text-sm" style={{ color: '#6B7F68' }}>
                We've sent a confirmation email to{' '}
                <strong style={{ color: '#4A5E47' }}>{order.customerEmail}</strong>
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card
            className="mb-6 border shadow-sm"
            style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
          >
            <CardHeader>
              <CardTitle
                className="text-xl font-bold"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                Order Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Order ID', value: order.id },
                  {
                    label: 'Status',
                    value: order.status,
                    isStatus: true,
                  },
                  {
                    label: 'Order Date',
                    value: new Date(order.timestamp).toLocaleDateString(),
                  },
                  {
                    label: 'Payment Method',
                    value: order.paymentMethod.replace('-', ' '),
                  },
                ].map(({ label, value, isStatus }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: '#F7F3ED', border: '1px solid #D4CCC0' }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7F68' }}>
                      {label}
                    </p>
                    <p
                      className="font-bold capitalize text-sm"
                      style={{ color: isStatus ? '#3A6B35' : '#1C2B1A' }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Items Ordered */}
          <Card
            className="mb-6 border shadow-sm"
            style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
          >
            <CardHeader>
              <CardTitle
                className="text-xl font-bold"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                Items Ordered
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl transition-all duration-200"
                    style={{ backgroundColor: '#F7F3ED', border: '1px solid #D4CCC0' }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: '#1C2B1A' }}>
                        {item.name}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: '#6B7F68' }}>
                        Quantity:{' '}
                        <span className="font-bold" style={{ color: '#3A6B35' }}>
                          {item.quantity}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#1C2B1A' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-5" style={{ backgroundColor: '#C8BAA8' }} />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold" style={{ color: '#1C2B1A' }}>
                  Total
                </span>
                <span className="text-xl font-bold" style={{ color: '#3A6B35' }}>
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/order-tracking')}
              className="font-bold rounded-xl py-3 transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
            >
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="font-bold rounded-xl py-3 transition-all duration-200 hover:scale-[1.02]"
              style={{
                borderColor: '#A8C9A0',
                color: '#3A6B35',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3A6B35';
                (e.currentTarget as HTMLButtonElement).style.color = '#F7F3ED';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#3A6B35';
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
};