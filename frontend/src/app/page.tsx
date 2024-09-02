"use client";

import { StoreProvider, useStoreContext } from '@/contexts/StoreContext';
import { CustomerReviews, Hero, PopularProducts } from '@/sections';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import ShoppingCart from '@/components/ShoppingCart';
import Image from 'next/image';

import cartIcon from '@/assets/icons/cart.svg';

export default function Home() {
  const { storeInfo, loading } = useStoreContext();
  const { setOpen } = useShoppingCart(); // Use the setOpen from the context to open/close cart
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!storeInfo) {
    return <div>Error loading store information</div>;
  }

  return (
    <div>
      <ShoppingCart />
      <div>
        <Image
          src={cartIcon}
          alt='cart icon'
          onClick={() => setOpen(true)}
          className="fixed top-10 right-10"
          height={50}
          width={50}
        />
      </div>
      <section className="xl:padding-l px-[15rem] wide:padding-r padding-b">
        <Hero />
      </section>

      <section className="padding px-[15rem]">
        <PopularProducts />
      </section>

      <section className="padding px-[15rem] pb-[1rem]">
        <CustomerReviews />
      </section>
    </div>
  );
}
