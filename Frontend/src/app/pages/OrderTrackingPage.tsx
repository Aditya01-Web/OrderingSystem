import { Package, CheckCircle, Clock, ChefHat } from 'lucide-react';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export const OrderTrackingPage = () => {
  const { orders } = useCart();

  const activeOrders = orders.filter((order) => order.status !== 'completed');
  const recentOrders = activeOrders.length > 0 ? activeOrders : orders.slice(0, 3);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Order Received', icon: Clock, color: 'bg-blue-500', progress: 25 };
      case 'preparing':
        return { label: 'Preparing', icon: ChefHat, color: 'bg-amber-500', progress: 60 };
      case 'ready':
        return { label: 'Ready for Pickup', icon: Package, color: 'bg-green-500', progress: 90 };
      case 'completed':
        return { label: 'Completed', icon: CheckCircle, color: 'bg-gray-500', progress: 100 };
      default:
        return { label: 'Unknown', icon: Clock, color: 'bg-gray-500', progress: 0 };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
        <Header />

        <main className="container mx-auto px-4 py-12">

          <Card className="max-w-md mx-auto text-center py-12 bg-[#151515] border border-[#C9A22733]">

            <CardContent>

              <Package className="w-16 h-16 mx-auto mb-4 text-[#C9A227]" />

              <h2 className="text-2xl font-semibold mb-2 text-[#C9A227]">
                No orders yet
              </h2>

              <p className="text-[#AFAFAF]">
                You haven't placed any orders yet.
              </p>

            </CardContent>

          </Card>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">

      <Header />

      <main className="container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6 text-[#C9A227]">
          Track Your Orders
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">

          {recentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={order.id}
                className="bg-[#151515] border border-[#C9A22733]"
              >

                <CardHeader>

                  <div className="flex justify-between items-start">

                    <div>
                      <CardTitle className="mb-2 text-[#F5F5F5]">
                        Order {order.id}
                      </CardTitle>

                      <p className="text-sm text-[#AFAFAF]">
                        Placed on {new Date(order.timestamp).toLocaleString()}
                      </p>

                    </div>

                    <Badge className="bg-[#C9A227] text-black">
                      {statusInfo.label}
                    </Badge>

                  </div>

                </CardHeader>

                <CardContent className="space-y-6">

                  {/* Progress */}

                  <div className="space-y-2">

                    <Progress
                      value={statusInfo.progress}
                      className="h-2 bg-[#222]"
                    />

                    <div className="flex justify-between text-sm text-[#AFAFAF]">
                      <span>Order Progress</span>
                      <span>{statusInfo.progress}%</span>
                    </div>

                  </div>


                  {/* Timeline */}

                  <div className="grid grid-cols-4 gap-4 mt-6">

                    {['pending','preparing','ready','completed'].map((status,index)=>{

                      const info = getStatusInfo(status);
                      const Icon = info.icon;

                      const isActive =
                        ['pending','preparing','ready','completed'].indexOf(order.status) >= index;

                      const isCurrent = order.status === status;

                      return (

                        <div key={status} className="text-center">

                          <div
                            className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                              isActive
                                ? isCurrent
                                  ? info.color
                                  : 'bg-[#2A2A2A]'
                                : 'bg-[#1A1A1A]'
                            }`}
                          >

                            <Icon
                              className={`w-6 h-6 ${
                                isActive ? 'text-white' : 'text-gray-500'
                              }`}
                            />

                          </div>

                          <p
                            className={`text-xs ${
                              isActive ? 'text-[#F5F5F5]' : 'text-[#AFAFAF]'
                            }`}
                          >
                            {info.label}
                          </p>

                        </div>

                      );

                    })}

                  </div>


                  {/* Items */}

                  <div className="border-t border-[#C9A22733] pt-4">

                    <h4 className="font-semibold mb-3 text-[#C9A227]">
                      Order Items
                    </h4>

                    <div className="space-y-2">

                      {order.items.map((item)=>(
                        <div key={item.id} className="flex justify-between text-sm">

                          <span className="text-[#AFAFAF]">
                            {item.name} x {item.quantity}
                          </span>

                          <span className="font-semibold text-[#F5F5F5]">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>

                        </div>
                      ))}

                      <div className="flex justify-between font-bold pt-2 border-t border-[#C9A22733]">

                        <span>Total</span>

                        <span className="text-[#C9A227]">
                          ₹{order.total.toFixed(2)}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Customer */}

                  <div className="border-t border-[#C9A22733] pt-4 grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-sm text-[#AFAFAF]">Customer</p>
                      <p className="font-semibold text-[#F5F5F5]">
                        {order.customerName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#AFAFAF]">Payment</p>
                      <p className="font-semibold capitalize text-[#F5F5F5]">
                        {order.paymentMethod.replace('-', ' ')}
                      </p>
                    </div>

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