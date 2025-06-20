'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

type CartItem = {
  productId: number;
  title: string;
  quantity: number;
  summary: number;
};

type CartContextType = {
  cart: CartItem[];
  updateItem: (
    productId: number,
    quantity: number,
    title: string,
    price: number
  ) => void;
  removeItem: (productId: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateItem = useCallback(
    (productId: number, quantity: number, title: string, price: number) => {
      setCart((prev) => {
        if (quantity === 0) {
          return prev.filter((item) => item.productId !== productId);
        }
        const exists = prev.find((item) => item.productId === productId);
        const summary = price * quantity;
        if (exists) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity, summary } : item
          );
        }
        return [...prev, { productId, quantity, title, summary }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  return (
    <CartContext.Provider value={{ cart, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
