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
import Link from "next/link";
import UpdateFromHome from "./Customization/UpdateFromHome";

const CarouselContainer = () => {
  const router = useRouter();

  const { storeInfo, loggedInUserId } = useStoreContext();
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

  const handleShopNow = () => {
    const storeInfoStr = encodeURIComponent(JSON.stringify(storeInfo.id));
    router.push(`/products?storeInfo=${storeInfoStr}`);
  };

  return (
    <>
      <Image
        className="pt-5 object-contain"
        src={
          storeInfo.logo_url === null
            ? "https://placehold.co/600x400/png"
            : storeInfo.logo_url
        }
        alt="store logo"
        width={120}
        height={120}
      />
      <section
        id="home"
        className="w-full flex xl:flex-row flex-col justify-center max-h-full gap-10 max-container px-40 py-5"
      >
        <div className="flex-1 flex justify-center items-center rounded-3xl xl:min-h-full max-xl:py-40 bg-hero bg-cover bg-center">
          <Carousel>
            <CarouselContent>
              {ui_images.map((img: string, index: number) => (
                <CarouselItem
                  key={index}
                  className="flex justify-center items-center max-h-[50vh]"
                >
                  <Image
                    src={img}
                    alt={`Carousel image ${index + 1}`}
                    width={2000}
                    height={2000}
                    className="w-full object-cover"
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

      <div className="flex w-full justify-center items-center gap-10">
        <Button
          onClick={handleShopNow}
          style={{ backgroundColor: storeInfo.ui_accent_color }}
        >
          Shop Now!
        </Button>
        <Button variant="ghost">
          See our social page
          <Link href="/products"></Link>
        </Button>
      </div>
    </>
  );
};

export default CarouselContainer;
