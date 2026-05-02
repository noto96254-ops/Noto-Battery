import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const cartKey = user ? `cart_${user._id}` : 'cart_guest';

  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCart([]);
      }
    } else {
      setCart([]);
    }
    setIsLoaded(true);
  }, [user, cartKey]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const current = Array.isArray(prev) ? prev : [];
      const pid = product._id || product.id;
      const exist = current.find(i => (i._id || i.id) === pid);
      if (exist) {
        return current.map(i => (i._id || i.id) === pid ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...current, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => (i._id || i.id) !== id));
  
  const updateQuantity = (id, q) => setCart(prev => prev.map(i => (i._id || i.id) === id ? { ...i, quantity: q } : i));

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(cartKey);
  };

  const cartTotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart error');
  return context;
}
