import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import Reviews from '@/components/Reviews';

export default function Home() {
  return (
    <main className="p-[14px] flex flex-col gap-[100px] items-center">
      <p className="text-center rounded-[15px] text-[40px] px-4 text-secondary bg-[#777777]">
        тестовое задание
      </p>

      <Reviews />
      <Cart />
      <ProductList />
    </main>
  );
}
