"use client";

import { useStoreContext } from "@/contexts/StoreContext";
import { Hero, PopularProducts } from "@/sections";
import ShoppingCart from "@/components/ShoppingCart";

import ShoppingCartContainer from "@/components/ShoppingCartContainer";
import CarouselContainer from "@/components/CarouselContainer";
import { Button } from "@/components/ui/button";
import CustomizeUiType from "@/components/Customization/CustomizeUiType";
import Link from "next/link";

export default function Home() {
  const { storeInfo, loggedUserInfo, loading } = useStoreContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!storeInfo) {
    return <div>Error loading store information</div>;
  }

  if (storeInfo.ui_type === 0) {
    return (
      <>
        <CustomizeUiType />
      </>
    );
  } else {
    return (
      <div>
        {storeInfo.id === loggedUserInfo.id && (
          <div className="relative">
            <div className="absolute top-5 left-8">
              <Button
                className="border-[1.5px] border-gray-200 hover:bg-black hover:text-white"
                variant={"ghost"}
              >
                <Link href={"/admin"}>Admin Panel</Link>
              </Button>
            </div>
            {/* Other elements can go here */}
          </div>
        )}

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
}
