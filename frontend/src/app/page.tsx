"use client";

import { StoreProvider, useStoreContext } from '@/contexts/StoreContext';
import { CustomerReviews, Hero, PopularProducts } from '@/sections';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import ShoppingCart from '@/components/ShoppingCart';

import ShoppingCartContainer from '@/components/ShoppingCartContainer';
import CarouselContainer from '@/components/CarouselContainer';

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
      <ShoppingCartContainer />



      <section className="xl:padding-l px-[15rem] wide:padding-r padding-b">
        {storeInfo.ui_type === 1 && <Hero />}
        {storeInfo.ui_type === 2 && <CarouselContainer />}
      </section>

      <section className="padding px-[15rem] pt-10">
        <PopularProducts />
      </section>
    </div>
  );
}
