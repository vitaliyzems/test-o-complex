'use client';

import { useCartContext } from '@/context/CartContext';
import { Product } from '@/types/Product';
import { useEffect, useState } from 'react';

export default function ProductActions({ product }: { product: Product }) {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const { id, title, price } = product;
  const { updateItem } = useCartContext();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const existingItem = cartItems.find(
        (item: { productId: number }) => item.productId === id
      );
      if (existingItem) {
        setCount(existingItem.quantity);
        setInputValue(String(existingItem.quantity));
      }
    }
  }, [id]);

  useEffect(() => {
    updateItem(id, count, title, price);
  }, [count, id, title, price, updateItem]);

  const increment = () => {
    setCount((c) => {
      const newCount = c + 1;
      setInputValue(String(newCount));
      return newCount;
    });
  };

  const decrement = () => {
    setCount((c) => {
      const newCount = c > 1 ? c - 1 : 0;
      setInputValue(newCount > 0 ? String(newCount) : '');
      return newCount;
    });
  };

  const handleBuy = () => {
    setCount(1);
    setInputValue('1');
  };

  if (count === 0) {
    return (
      <button
        onClick={handleBuy}
        className="w-full h-[68px] bg-primary bg-background text-secondary text-4xl rounded-[15px]"
      >
        Купить
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 h-[68px]">
      <button
        onClick={decrement}
        className="w-[68px] h-full rounded-[15px] bg-background text-secondary text-4xl"
        aria-label="Убавить"
      >
        –
      </button>
      <input
        type="number"
        min={1}
        value={inputValue}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val >= 1) {
            setCount(val);
            setInputValue(e.target.value);
          } else {
            setInputValue('');
          }
        }}
        onBlur={(e) => {
          if (e.target.value === '') {
            setCount(0);
          }
        }}
        className="h-full min-w-0 flex-1 text-center bg-background text-secondary rounded-[15px]"
        aria-label="Количество"
      />
      <button
        onClick={increment}
        className="w-[68px] h-full rounded-[15px] bg-background text-secondary text-4xl"
        aria-label="Добавить"
      >
        +
      </button>
    </div>
  );
}
