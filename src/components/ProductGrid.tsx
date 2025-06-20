/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Product } from '@/types/Product';
import ProductActions from './ProductActions';
import { useCartContext } from '@/context/CartContext';

export default function ProductGrid({
  initialItems,
}: {
  initialItems: Product[];
}) {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { cart } = useCartContext();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);

  useEffect(() => {
    const fetchMore = async () => {
      const res = await fetch(
        `http://o-complex.com:1337/products?page=${page}&page_size=20`
      );
      const data = await res.json();
      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }
    };

    if (page > 1) {
      fetchMore();
    }
  }, [page]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <article
            key={product.id}
            className="flex flex-col justify-between h-full bg-foreground p-3 rounded-[15px] shadow space-y-4 max-w-[400px]"
          >
            <header>
              <img
                src={product.image_url}
                alt={product.title}
                width={300}
                height={160}
                loading="lazy"
                className="w-full h-[366px] object-cover rounded"
              />
              <h3 className="text-4xl font-semibold mt-3 text-center">
                {product.title}
              </h3>
            </header>
            <section className="flex-grow">
              <p className="line-clamp-3 min-h-[72px] overflow-hidden text-ellipsis">
                {product.description}
              </p>
            </section>

            {/* <footer> */}
            <footer className="flex flex-col gap-2">
              <p className="font-bold">Цена: {product.price}₽</p>
              <ProductActions product={product} />
            </footer>
          </article>
        ))}
      </section>

      <div ref={loaderRef} className="h-10" />
    </>
  );
}
