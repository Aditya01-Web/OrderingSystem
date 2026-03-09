import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const CheckoutPage = () => {
  const { cart, getCartTotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'credit-card',
  });

  const total = getCartTotal();
  const tax = total * 0.1;
  const grandTotal = total + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = placeOrder({
      name: formData.name,
      email: formData.email,
      paymentMethod: formData.paymentMethod,
    });

    setIsProcessing(false);
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${orderId}`);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const paymentMethods = [
    { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
    { id: 'debit-card', label: 'Debit Card', icon: Wallet },
    { id: 'cash', label: 'Cash on Pickup', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
      <Header />

      <main className="container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6 text-[#C9A227]">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-6">

            <Card className="bg-[#151515] border border-[#C9A227]/20">
              <CardHeader>
                <CardTitle className="text-[#C9A227]">
                  Customer Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div>
                  <Label htmlFor="name" className="text-[#AFAFAF]">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="bg-[#0F0F0F] border-[#C9A227]/20 text-[#F5F5F5]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#AFAFAF]">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="bg-[#0F0F0F] border-[#C9A227]/20 text-[#F5F5F5]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-[#AFAFAF]">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="bg-[#0F0F0F] border-[#C9A227]/20 text-[#F5F5F5]"
                    required
                  />
                </div>

              </CardContent>
            </Card>


            {/* Payment */}
            <Card className="bg-[#151515] border border-[#C9A227]/20">
              <CardHeader>
                <CardTitle className="text-[#C9A227]">
                  Payment Method
                </CardTitle>
              </CardHeader>

              <CardContent>

                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >

                  <div className="space-y-3">

                    {paymentMethods.map((method) => (

                      <div
                        key={method.id}
                        className="flex items-center space-x-3 border border-[#C9A227]/20 rounded-lg p-4 hover:bg-[#151515] cursor-pointer"
                      >

                        <RadioGroupItem value={method.id} id={method.id} />

                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-3 cursor-pointer flex-1 text-[#F5F5F5]"
                        >

                          <method.icon className="w-5 h-5 text-[#C9A227]" />

                          <span>{method.label}</span>

                        </Label>

                      </div>

                    ))}

                  </div>

                </RadioGroup>

              </CardContent>
            </Card>

          </div>


          {/* Order Summary */}
          <div className="lg:col-span-1">

            <Card className="sticky top-20 bg-[#151515] border border-[#C9A227]/20">

              <CardHeader>
                <CardTitle className="text-[#C9A227]">
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="space-y-3 max-h-60 overflow-y-auto">

                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">

                      <span className="text-[#AFAFAF]">
                        {item.name} x {item.quantity}
                      </span>

                      <span className="font-semibold text-[#F5F5F5]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>

                    </div>
                  ))}

                </div>

                <Separator className="bg-[#C9A227]/20" />

                <div className="flex justify-between">
                  <span className="text-[#AFAFAF]">Subtotal</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#AFAFAF]">Tax (10%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                <Separator className="bg-[#C9A227]/20" />

                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-[#C9A227]">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#E6C75A] text-black font-bold"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>

              </CardContent>

            </Card>

          </div>

        </form>

      </main>
    </div>
  );
};