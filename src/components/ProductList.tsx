import { Product } from '@/types/Product';
import ProductGrid from './ProductGrid';

export default async function ProductList() {
  const res = await fetch(
    'http://o-complex.com:1337/products?page=1&page_size=20',
    {
      cache: 'no-store',
    }
  );
  const data = await res.json();
  const items: Product[] = data.items;

  return (
    <>
      <ProductGrid initialItems={items} />
    </>
  );
}
