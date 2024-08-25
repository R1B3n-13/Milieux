"use client";

import { StoreProvider, useStoreContext } from '@/contexts/StoreContext';
import { CustomerReviews, Hero, PopularProducts } from '@/sections';
import ShoppingCart from '@/components/ShoppingCart';

export default function Home() {
  const { storeInfo, loading } = useStoreContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!storeInfo) {
    return <div>Error loading store information</div>;
  }

  return (
    <div>
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
