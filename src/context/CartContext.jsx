import { useState } from 'react';
import { CartContext } from './cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addItem = (item, restaurantId) => {
    if (cart.length && cart[0].restaurantId !== restaurantId) {
      if (!window.confirm('Adding items from a new restaurant will clear your current cart. Continue?')) return;
      setCart([]);
    }
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1, restaurantId }];
    });
  };

  const updateQty = (itemId, delta) => {
    setCart(prev =>
      prev.map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
