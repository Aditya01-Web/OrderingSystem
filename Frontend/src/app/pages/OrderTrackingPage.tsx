import { useEffect } from 'react';
import { Package, CheckCircle, Clock, ChefHat } from 'lucide-react';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { trackOrder } from '../services/adminApi';
import { Progress } from '../components/ui/progress';

export const OrderTrackingPage = () => {
  const { orders, updateOrderStatus } = useCart();

  const activeOrders = orders.filter((order) => order.status !== 'completed');
  const recentOrders = activeOrders.length > 0 ? activeOrders : orders.slice(0, 3);

  useEffect(() => {
    if (activeOrders.length === 0) return;

    const fetchStatuses = async () => {
      for (const order of activeOrders) {
        try {
          const data = await trackOrder(order.id);
          // Map backend status to frontend status
          let newStatus: any = 'pending';
          if (data.status === 'Placed') newStatus = 'pending';
          if (data.status === 'Preparing') newStatus = 'preparing';
          if (data.status === 'Ready') newStatus = 'ready';
          if (data.status === 'Completed') newStatus = 'completed';
          
          if (order.status !== newStatus) {
            updateOrderStatus(order.id, newStatus);
          }
        } catch (err) {
          console.error(`Failed to track order ${order.id}:`, err);
        }
      }
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [activeOrders, updateOrderStatus]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
      case 'Placed':
        return { label: 'Order Received', icon: Clock, progress: 25, bg: '#DBEAFE', color: '#1D4ED8' };
      case 'preparing':
      case 'Preparing':
        return { label: 'Preparing', icon: ChefHat, progress: 60, bg: '#FEF3C7', color: '#B45309' };
      case 'ready':
      case 'Ready':
        return { label: 'Ready for Pickup', icon: Package, progress: 90, bg: '#D6E9D0', color: '#3A6B35' };
      case 'completed':
      case 'Completed':
        return { label: 'Completed', icon: CheckCircle, progress: 100, bg: '#E8F0E5', color: '#3A6B35' };
      default:
        return { label: 'Unknown', icon: Clock, progress: 0, bg: '#EDE8E0', color: '#6B7F68' };
    }
  };

  const allSteps = ['pending', 'preparing', 'ready', 'completed'];

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
                <Package className="w-10 h-10" style={{ color: '#3A6B35' }} />
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                No orders yet
              </h2>
              <p style={{ color: '#6B7F68' }}>You haven't placed any orders yet.</p>
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

        {/* Title */}
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
        >
          Track Your Orders
        </h1>
        <div className="w-20 h-[3px] rounded-full mb-8" style={{ backgroundColor: '#7EB67A' }} />

        <div className="max-w-4xl mx-auto space-y-6">
          {recentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const currentStepIndex = allSteps.indexOf(order.status);

            return (
              <Card
                key={order.id}
                className="border shadow-sm transition-all duration-200"
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
                        className="mb-1 font-bold text-lg"
                        style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                      >
                        Order {order.id}
                      </CardTitle>
                      <p className="text-xs" style={{ color: '#6B7F68' }}>
                        Placed on {new Date(order.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border flex items-center gap-1.5"
                      style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        borderColor: statusInfo.color + '55',
                      }}
                    >
                      <statusInfo.icon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div
                      className="w-full h-2.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#D4CCC0' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${statusInfo.progress}%`,
                          backgroundColor: '#3A6B35',
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: '#6B7F68' }}>
                      <span>Order Progress</span>
                      <span className="font-bold" style={{ color: '#3A6B35' }}>
                        {statusInfo.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Timeline Steps */}
                  <div className="grid grid-cols-4 gap-2">
                    {allSteps.map((status, index) => {
                      const info = getStatusInfo(status);
                      const Icon = info.icon;
                      const isPast = currentStepIndex > index;
                      const isCurrent = currentStepIndex === index;
                      const isFuture = currentStepIndex < index;

                      return (
                        <div key={status} className="text-center relative">
                          {/* Connector line */}
                          {index < allSteps.length - 1 && (
                            <div
                              className="absolute top-5 left-1/2 w-full h-[2px] -z-0"
                              style={{
                                backgroundColor: isPast || isCurrent ? '#7EB67A' : '#D4CCC0',
                              }}
                            />
                          )}

                          {/* Step circle */}
                          <div
                            className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center relative z-10 transition-all duration-300"
                            style={{
                              backgroundColor: isCurrent
                                ? '#3A6B35'
                                : isPast
                                ? '#D6E9D0'
                                : '#E8E2D9',
                              border: isCurrent
                                ? '3px solid #7EB67A'
                                : isPast
                                ? '2px solid #A8C9A0'
                                : '2px solid #C8BAA8',
                            }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{
                                color: isCurrent ? '#F7F3ED' : isPast ? '#3A6B35' : '#B0A898',
                              }}
                            />
                          </div>

                          <p
                            className="text-xs font-semibold leading-tight"
                            style={{
                              color: isCurrent ? '#3A6B35' : isPast ? '#4A5E47' : '#A8B8A5',
                            }}
                          >
                            {info.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Items */}
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: '#C8BAA8' }}
                  >
                    <h4
                      className="font-bold mb-3 text-sm uppercase tracking-wide"
                      style={{ color: '#3A6B35' }}
                    >
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm py-1.5 px-3 rounded-lg"
                          style={{ backgroundColor: '#F7F3ED' }}
                        >
                          <span style={{ color: '#4A5E47' }}>
                            {item.name}{' '}
                            <span className="font-bold" style={{ color: '#3A6B35' }}>
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-semibold" style={{ color: '#1C2B1A' }}>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      <div
                        className="flex justify-between font-bold pt-2 mt-1 border-t"
                        style={{ borderColor: '#C8BAA8' }}
                      >
                        <span style={{ color: '#1C2B1A' }}>Total</span>
                        <span style={{ color: '#3A6B35' }}>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div
                    className="pt-4 border-t grid grid-cols-2 gap-4"
                    style={{ borderColor: '#C8BAA8' }}
                  >
                    {[
                      { label: 'Customer', value: order.customerName },
                      { label: 'Payment', value: order.paymentMethod.replace('-', ' ') },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: '#F7F3ED', border: '1px solid #D4CCC0' }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7F68' }}>
                          {label}
                        </p>
                        <p className="font-bold text-sm capitalize" style={{ color: '#1C2B1A' }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};