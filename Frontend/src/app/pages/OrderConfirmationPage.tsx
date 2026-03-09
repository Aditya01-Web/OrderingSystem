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
      <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center py-12 bg-[#151515] border border-[#C9A227]/20">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-2 text-[#C9A227]">
                Order not found
              </h2>
              <p className="text-[#AFAFAF] mb-6">
                We couldn't find this order.
              </p>

              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-[#C9A227] to-[#E6C75A] text-black font-bold"
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
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Success Message */}
          <Card className="mb-6 bg-[#151515] border border-[#C9A227]/20">
            <CardContent className="pt-6 text-center">

              <CheckCircle className="w-16 h-16 text-[#C9A227] mx-auto mb-4" />

              <h1 className="text-3xl font-bold text-[#C9A227] mb-2">
                Order Confirmed!
              </h1>

              <p className="text-lg text-[#F5F5F5] mb-4">
                Thank you for your order, {order.customerName}!
              </p>

              <p className="text-[#AFAFAF]">
                We've sent a confirmation email to <strong>{order.customerEmail}</strong>
              </p>

            </CardContent>
          </Card>


          {/* Order Details */}
          <Card className="mb-6 bg-[#151515] border border-[#C9A227]/20">
            <CardHeader>
              <CardTitle className="text-[#C9A227]">
                Order Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-[#AFAFAF]">Order ID</p>
                  <p className="font-semibold">{order.id}</p>
                </div>

                <div>
                  <p className="text-sm text-[#AFAFAF]">Status</p>
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>

                <div>
                  <p className="text-sm text-[#AFAFAF]">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#AFAFAF]">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {order.paymentMethod.replace('-', ' ')}
                  </p>
                </div>

              </div>

            </CardContent>
          </Card>


          {/* Items Ordered */}
          <Card className="mb-6 bg-[#151515] border border-[#C9A227]/20">
            <CardHeader>
              <CardTitle className="text-[#C9A227]">
                Items Ordered
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#F5F5F5]">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#AFAFAF]">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

              <Separator className="my-4 bg-[#C9A227]/20" />

              <div className="flex justify-between text-lg font-bold">

                <span>Total</span>

                <span className="text-[#C9A227]">
                  ₹{order.total.toFixed(2)}
                </span>

              </div>

            </CardContent>
          </Card>


          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Button
              onClick={() => navigate('/order-tracking')}
              className="bg-gradient-to-r from-[#C9A227] to-[#E6C75A] text-black font-bold"
            >
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-[#C9A227]/40 text-[#F5F5F5] hover:bg-[#C9A227] hover:text-black"
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