import { useStoreContext } from "@/contexts/StoreContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import UpdateFromHome from "./Customization/UpdateFromHome";
import Link from "next/link";

const CarouselContainer = () => {
  const router = useRouter();

  const socialFrontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  const { storeInfo, loggedInUserId, loading } = useStoreContext();
  const [ui_images, setUi_images] = useState([
    "https://placehold.co/600x400/png",
    "https://placehold.co/600x400/png",
  ]);

  if (!storeInfo) {
    return <p>Loading store info...</p>;
  }

  useEffect(() => {
    if (storeInfo.ui_images !== null) {
      setUi_images(storeInfo.ui_images);
    }
  }, [storeInfo.ui_images]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section
        id="home"
        className="w-full flex xl:flex-row flex-col justify-center pb-5 max-h-full gap-10 max-container"
      >
        <div className="flex-1 flex justify-center items-center rounded-xl xl:min-h-full max-xl:py-40  bg-hero bg-cover bg-center overflow-hidden">
          <Carousel>
            <CarouselContent>
              {ui_images.map((img: string, index: number) => (
                <CarouselItem
                  key={index}
                  className="flex justify-center items-center max-h-[70vh]"
                >
                  <Image
                    src={img}
                    alt={`Carousel image ${index + 1}`}
                    width={2000}
                    height={2000}
                    className="w-full object-cover rounded-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      {/* update carousel images */}
      {loggedInUserId === storeInfo.id && <UpdateFromHome />}

      <div className="flex w-full justify-center items-center gap-2">
        <Button
          // onClick={handleShopNow}
          style={{ backgroundColor: storeInfo.ui_accent_color }}
        >
          <Link href={`/products?id=${storeInfo.id}`}>Shop Now!</Link>
        </Button>

        <a
          href={`${socialFrontendUrl}/persona/${storeInfo.id}`}
          style={{ backgroundColor: storeInfo.ui_secondary_color }}
          className="p-2 rounded-lg"
        >
          See our social page
        </a>
      </div>
    </>
  );
};

export default CarouselContainer;
