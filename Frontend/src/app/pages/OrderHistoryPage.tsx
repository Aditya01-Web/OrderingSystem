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
    const variants: Record<string, { label: string; className: string }> = {
      pending: {
        label: 'Pending',
        className: 'bg-[#1E293B] text-[#F5F5F5] border border-[#C9A227]/30',
      },
      preparing: {
        label: 'Preparing',
        className: 'bg-[#7C5E10] text-white',
      },
      ready: {
        label: 'Ready',
        className: 'bg-[#166534] text-white',
      },
      completed: {
        label: 'Completed',
        className: 'border border-[#C9A227] text-[#C9A227]',
      },
    };

    const info = variants[status] || variants.pending;

    return <Badge className={info.className}>{info.label}</Badge>;
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
        <Header />

        <main className="container mx-auto px-4 py-12">

          <Card className="max-w-md mx-auto text-center py-12 bg-[#151515] border border-[#C9A227]/20">

            <CardContent>

              <History className="w-16 h-16 mx-auto mb-4 text-[#C9A227]" />

              <h2 className="text-2xl font-semibold mb-2 text-[#C9A227]">
                No order history
              </h2>

              <p className="text-[#AFAFAF] mb-6">
                You haven't placed any orders yet. Start browsing our menu!
              </p>

              <Button className="bg-gradient-to-r from-[#C9A227] to-[#E6C75A] text-black font-bold">
                <a href="/">Browse Menu</a>
              </Button>

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

        <div className="flex items-center gap-3 mb-6">
          <History className="w-8 h-8 text-[#C9A227]" />
          <h1 className="text-3xl font-bold text-[#C9A227]">
            Order History
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">

          {orders.map((order, index) => (

            <Card
              key={order.id}
              className="bg-[#151515] border border-[#C9A227]/20 hover:shadow-[0_0_25px_rgba(201,162,39,0.15)] transition-all"
            >

              <CardHeader>

                <div className="flex justify-between items-start">

                  <div>
                    <CardTitle className="text-lg mb-1 text-[#F5F5F5]">
                      Order #{orders.length - index}
                    </CardTitle>

                    <p className="text-sm text-[#AFAFAF]">{order.id}</p>

                    <p className="text-sm text-[#AFAFAF] mt-1">
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

                    <div key={item.id} className="flex gap-3">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">

                        <h4 className="font-semibold text-[#F5F5F5]">
                          {item.name}
                        </h4>

                        <p className="text-sm text-[#AFAFAF]">
                          Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-semibold text-[#F5F5F5]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

                <Separator className="my-4 bg-[#C9A227]/20" />

                {/* Order Summary */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  <div>
                    <p className="text-sm text-[#AFAFAF]">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#AFAFAF]">Email</p>
                    <p className="font-semibold text-sm truncate">
                      {order.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#AFAFAF]">Payment</p>
                    <p className="font-semibold capitalize">
                      {order.paymentMethod.replace('-', ' ')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#AFAFAF]">Total</p>
                    <p className="font-bold text-[#C9A227] text-lg">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>


        {/* Summary Card */}

        <Card className="max-w-4xl mx-auto mt-8 bg-[#151515] border border-[#C9A227]/20">

          <CardHeader>
            <CardTitle className="text-[#C9A227]">
              Summary
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-[#C9A227]" />
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-[#AFAFAF]">Total Orders</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === 'completed').length}
                </p>
                <p className="text-sm text-[#AFAFAF]">Completed</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-[#C9A227]">
                  ₹{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
                <p className="text-sm text-[#AFAFAF]">Total Spent</p>
              </div>

            </div>

          </CardContent>

        </Card>

      </main>

    </div>
  );
};