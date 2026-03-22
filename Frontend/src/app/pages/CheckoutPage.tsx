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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED', color: '#1C2B1A' }}>
      <Header />

      <main className="container mx-auto px-4 py-8">

        {/* Page Title */}
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
        >
          Checkout
        </h1>
        <div className="w-16 h-[3px] rounded-full mb-8" style={{ backgroundColor: '#7EB67A' }} />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Customer Info + Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Customer Information */}
            <Card
              className="border shadow-sm"
              style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
            >
              <CardHeader>
                <CardTitle
                  className="text-xl font-bold"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                >
                  Customer Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-semibold" style={{ color: '#4A5E47' }}>
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="rounded-xl border transition-all duration-200 focus:ring-2"
                    style={{
                      backgroundColor: '#F7F3ED',
                      borderColor: '#C8BAA8',
                      color: '#1C2B1A',
                    }}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-semibold" style={{ color: '#4A5E47' }}>
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="rounded-xl border transition-all duration-200 focus:ring-2"
                    style={{
                      backgroundColor: '#F7F3ED',
                      borderColor: '#C8BAA8',
                      color: '#1C2B1A',
                    }}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-semibold" style={{ color: '#4A5E47' }}>
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    required
                    className="rounded-xl border transition-all duration-200 focus:ring-2"
                    style={{
                      backgroundColor: '#F7F3ED',
                      borderColor: '#C8BAA8',
                      color: '#1C2B1A',
                    }}
                  />
                </div>

              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card
              className="border shadow-sm"
              style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
            >
              <CardHeader>
                <CardTitle
                  className="text-xl font-bold"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                >
                  Payment Method
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const isSelected = formData.paymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          className="flex items-center space-x-3 rounded-xl p-4 cursor-pointer border transition-all duration-200"
                          style={{
                            backgroundColor: isSelected ? '#D6E9D0' : '#F7F3ED',
                            borderColor: isSelected ? '#7EB67A' : '#C8BAA8',
                            borderLeftWidth: isSelected ? '4px' : '1px',
                          }}
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="border-[#A8C9A0] text-[#3A6B35]"
                          />
                          <Label
                            htmlFor={method.id}
                            className="flex items-center gap-3 cursor-pointer flex-1 font-medium"
                            style={{ color: '#1C2B1A' }}
                          >
                            <method.icon
                              className="w-5 h-5"
                              style={{ color: isSelected ? '#3A6B35' : '#6B7F68' }}
                            />
                            <span>{method.label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <Card
              className="sticky top-20 border shadow-sm"
              style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
            >
              <CardHeader>
                <CardTitle
                  className="text-xl font-bold"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                >
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-1 border-b last:border-0"
                      style={{ borderColor: '#C8BAA8' }}
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
                </div>

                <Separator style={{ backgroundColor: '#C8BAA8' }} />

                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7F68' }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: '#1C2B1A' }}>₹{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7F68' }}>Tax (10%)</span>
                  <span className="font-semibold" style={{ color: '#1C2B1A' }}>₹{tax.toFixed(2)}</span>
                </div>

                <Separator style={{ backgroundColor: '#C8BAA8' }} />

                <div className="flex justify-between text-lg">
                  <span className="font-bold" style={{ color: '#1C2B1A' }}>Total</span>
                  <span className="font-bold text-xl" style={{ color: '#3A6B35' }}>
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full font-bold rounded-xl py-3 uppercase tracking-wide transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </Button>

              </CardContent>
            </Card>
          </div>

        </form>
      </main>
    </div>
  );
};