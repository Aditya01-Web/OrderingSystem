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
      <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
        <Header />
        <main className="container mx-auto px-4 py-12">

          <Card className="max-w-md mx-auto text-center py-12 bg-[#151515] border border-[#C9A227]/20">

            <CardContent>

              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#C9A227]" />

              <h2 className="text-2xl font-bold mb-2 text-[#F5F5F5]">
                Your cart is empty
              </h2>

              <p className="text-[#AFAFAF] mb-6">
                Add some delicious items to get started!
              </p>

              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-[#C9A227] to-[#E6C75A] hover:opacity-90 text-black font-bold"
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
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
      <Header />

      <main className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-8 text-[#C9A227]">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}

          <div className="lg:col-span-2 space-y-4">

            {cart.map((item) => (

              <Card
                key={item.id}
                className="bg-[#151515] border border-[#C9A227]/20 hover:border-[#C9A227]/50 hover:shadow-[0_0_20px_rgba(201,162,39,0.2)] transition-all"
              >

                <CardContent className="p-6">

                  <div className="flex gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">

                      <h3 className="font-bold text-lg mb-1 text-[#F5F5F5]">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-[#AFAFAF] mb-2">
                          {item.description}
                        </p>
                      )}

                      <p className="text-lg font-bold text-[#C9A227]">
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
                          className="h-8 w-8 border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <span className="w-8 text-center font-bold text-[#F5F5F5]">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
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

            <Card className="sticky top-20 bg-[#151515] border border-[#C9A227]/20">

              <CardHeader>

                <CardTitle className="text-[#C9A227] text-2xl">
                  Order Summary
                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-[#AFAFAF]">Subtotal</span>
                  <span className="font-bold text-[#F5F5F5]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#AFAFAF]">Tax (10%)</span>
                  <span className="font-bold text-[#F5F5F5]">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <Separator className="bg-[#C9A227]/20" />

                <div className="flex justify-between text-xl">
                  <span className="font-bold text-[#F5F5F5]">Total</span>
                  <span className="font-bold text-[#C9A227]">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>

              </CardContent>

              <CardFooter className="flex flex-col gap-3">

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#E6C75A] text-black font-bold uppercase tracking-wide"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full border-[#C9A227]/40 text-[#F5F5F5] hover:bg-[#C9A227] hover:text-black"
                >
                  Continue Shopping
                </Button>

              </CardFooter>

            </Card>

          </div>

        </div>

      </main>
    </div>
  );
};