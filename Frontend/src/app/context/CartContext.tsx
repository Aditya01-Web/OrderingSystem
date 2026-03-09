import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  placeOrder: (customerInfo: {
    name: string;
    email: string;
    paymentMethod: string;
  }) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Load cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cafe-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load orders from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cafe-orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart
  useEffect(() => {
    localStorage.setItem('cafe-cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders
  useEffect(() => {
    localStorage.setItem('cafe-orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);

      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const placeOrder = (customerInfo: {
    name: string;
    email: string;
    paymentMethod: string;
  }) => {

    const orderId = `ORDER-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      timestamp: new Date().toISOString(),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      paymentMethod: customerInfo.paymentMethod,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // simulate order progression
    setTimeout(() => updateOrderStatus(orderId, 'preparing'), 2000);
    setTimeout(() => updateOrderStatus(orderId, 'ready'), 5000);

    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};