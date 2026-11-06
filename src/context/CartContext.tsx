import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, OrderItem } from '../types';

interface CartContextType {
  cart: OrderItem[];
  isOpen: boolean;
  orderType: 'pickup' | 'delivery';
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  totalItemsCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setOrderType: (type: 'pickup' | 'delivery') => void;
  setCustomerName: (name: string) => void;
  setPhone: (phone: string) => void;
  setAddress: (addr: string) => void;
  setNotes: (notes: string) => void;
  setDeliveryConfig: (active: boolean, fee: number, minOrder: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('burger_bite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Delivery settings
  const [deliveryActive, setDeliveryActive] = useState(true);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(100);
  const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(1500);

  useEffect(() => {
    try {
      localStorage.setItem('burger_bite_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [cart]);

  const setDeliveryConfig = (active: boolean, fee: number, minOrder: number) => {
    setDeliveryActive(active);
    setBaseDeliveryFee(fee);
    setMinOrderForFreeDelivery(minOrder);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (item: MenuItem, quantity: number = 1, instructions: string = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (instructions) {
          updated[existingIndex].specialInstructions = instructions;
        }
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity,
            specialInstructions: instructions,
            imageUrl: item.imageUrl,
          },
        ];
      }
    });
    setIsOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee logic
  const deliveryFee =
    orderType === 'delivery' && deliveryActive
      ? subtotal >= minOrderForFreeDelivery || subtotal === 0
        ? 0
        : baseDeliveryFee
      : 0;

  const totalAmount = subtotal + deliveryFee;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        orderType,
        customerName,
        phone,
        address,
        notes,
        subtotal,
        deliveryFee,
        totalAmount,
        totalItemsCount,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setOrderType,
        setCustomerName,
        setPhone,
        setAddress,
        setNotes,
        setDeliveryConfig,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
