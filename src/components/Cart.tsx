'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useMask } from '@react-input/mask';
import { useCartContext } from '@/context/CartContext';

export default function Cart() {
  const { cart } = useCartContext();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');

  const inputRef = useMask({
    mask: '+7 (___) ___-__-__',
    replacement: { _: /\d/ },
    showMask: true,
  });

  useEffect(() => {
    const savedPhone = localStorage.getItem('phone');
    if (savedPhone) {
      setPhoneValue(savedPhone);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phone', phoneValue);
  }, [phoneValue]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      setError('Введите полный номер телефона');
      return;
    }

    setError(null);

    const response = await fetch('http://o-complex.com:1337/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneDigits,
        cart: cart.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    const result = await response.json();

    if (result.success === 1) {
      setShowModal(true);
    } else {
      setError(result.error || 'Ошибка при оформлении заказа');
    }
  };

  return (
    <form
      className="bg-foreground rounded-[15px] p-3 space-y-6"
      onSubmit={handleSubmit}
    >
      <fieldset className="space-y-2">
        <legend className="text-4xl text-center">Добавленные товары</legend>

        {cart.length === 0 && <span>Ничего не выбрано</span>}

        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between"
          >
            <span className="max-w-[60%]">{item.title}</span>
            <div className="flex w-[40%] justify-between">
              <span>x{item.quantity}</span>
              <span>{item.summary}&#8381;</span>
            </div>
          </div>
        ))}
      </fieldset>

      <div className="flex flex-col gap-3 min-lg:flex-row">
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            className="h-[68px] bg-background text-secondary min-md:text-4xl text-2xl text-center rounded-[15px] p-3"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full min-w-[268px] h-[68px] bg-background text-secondary text-4xl text-center rounded-[15px] p-3"
        >
          Заказать
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-background text-secondary p-6 rounded-[15px] max-w-sm w-full text-center space-y-4 shadow-lg">
            <h2 className="text-2xl font-semibold">Спасибо за заказ!</h2>
            <p>Ваш заказ был успешно оформлен.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-6 py-2 bg-foreground text-background rounded-[10px] text-lg"
            >
              ОК
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
