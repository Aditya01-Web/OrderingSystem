import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const total = getCartTotal();
  const tax = total * 0.1;
  const grandTotal = total + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen text-[#1C2B1A]" style={{ backgroundColor: '#F7F3ED' }}>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card
            className="max-w-md mx-auto text-center py-12 border shadow-sm"
            style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
          >
            <CardContent>
              <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: '#3A6B35' }} />
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
              >
                Your cart is empty
              </h2>
              <p className="mb-6" style={{ color: '#4A5E47' }}>
                Add some delicious items to get started!
              </p>
              <Button
                onClick={() => navigate('/')}
                className="font-bold hover:opacity-90"
                style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
              >
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1C2B1A]" style={{ backgroundColor: '#F7F3ED' }}>
      <Header />

      <main className="container mx-auto px-4 py-8">

        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
        >
          Your Bucket
        </h1>
        <div className="w-16 h-[3px] rounded-full mb-8" style={{ backgroundColor: '#7EB67A' }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card
                key={item.id}
                className="border shadow-sm transition-all hover:shadow-md"
                style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      style={{ outline: '1px solid #C8BAA8' }}
                    />
                    <div className="flex-1">
                      <h3
                        className="font-bold text-lg mb-1"
                        style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                      >
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm mb-2" style={{ color: '#4A5E47' }}>
                          {item.description}
                        </p>
                      )}
                      <p className="text-lg font-bold" style={{ color: '#3A6B35' }}>
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 transition-all"
                          style={{ borderColor: '#A8C9A0', color: '#3A6B35' }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-bold" style={{ color: '#1C2B1A' }}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 transition-all"
                          style={{ borderColor: '#A8C9A0', color: '#3A6B35' }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card
              className="sticky top-20 border shadow-sm"
              style={{ backgroundColor: '#EDE8E0', borderColor: '#C8BAA8' }}
            >
              <CardHeader>
                <CardTitle
                  className="text-2xl font-bold"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
                >
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span style={{ color: '#6B7F68' }}>Subtotal</span>
                  <span className="font-bold" style={{ color: '#1C2B1A' }}>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6B7F68' }}>Tax (10%)</span>
                  <span className="font-bold" style={{ color: '#1C2B1A' }}>₹{tax.toFixed(2)}</span>
                </div>
                <Separator style={{ backgroundColor: '#C8BAA8' }} />
                <div className="flex justify-between text-xl">
                  <span className="font-bold" style={{ color: '#1C2B1A' }}>Total</span>
                  <span className="font-bold" style={{ color: '#3A6B35' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full font-bold uppercase tracking-wide hover:opacity-90"
                  style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full font-bold uppercase tracking-wide hover:opacity-90"
                  style={{ borderColor: '#A8C9A0', color: '#3A6B35' }}
                >
                  Explore Menu
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};