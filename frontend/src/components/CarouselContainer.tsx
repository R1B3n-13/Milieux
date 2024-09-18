import { useStoreContext } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

const CarouselContainer = () => {
    const router = useRouter();

    // Access storeInfo from the context
    const { storeInfo } = useStoreContext();

    // Ensure storeInfo is available
    if (!storeInfo) {
        return <p>Loading store info...</p>;
    }

    const banner = storeInfo.banner;
    const accentColor = storeInfo.ui_accent_color;
    const ui_secondary_color = storeInfo.ui_secondary_color;
    const name = storeInfo.name;
    const ui_images = storeInfo.ui_images;
    const banner_subtitle = storeInfo.banner_subtext;
    const [bigImage, setBigImage] = useState(ui_images[0]);

    const handleShopNow = () => {
        const storeInfoStr = encodeURIComponent(JSON.stringify(storeInfo.id));
        router.push(`/products?storeInfo=${storeInfoStr}`);
    };

    return (
        <>
            <div className='flex justify-start items-start'>
                <h1 className='text-4xl py-10 font-montserrat font-bold'>{storeInfo.name}</h1>
            </div>
            <section id="home" className="w-full flex xl:flex-row flex-col justify-center max-h-full gap-10 max-container px-10">
                <div className="flex-1 flex justify-center items-center rounded-3xl xl:min-h-full max-xl:py-40 bg-hero bg-cover bg-center" >
                    <Carousel>
                        <CarouselContent>
                            {ui_images.map((img: string, index: number) => (
                                <CarouselItem key={index} className="flex justify-center items-center h-[600px]">
                                    <Image
                                        src={img}
                                        alt={`Carousel image ${index + 1}`}
                                        width={500}
                                        height={500}
                                        className="w-fit m-10"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </section>

            <div className='flex w-full justify-center items-center gap-10'>
                <Button onClick={handleShopNow} style={{ backgroundColor: storeInfo.ui_accent_color }}>
                    Shop Now!
                </Button>
                <Button variant='ghost'>
                    See our social page
                    <Link href='/products'>
                    </Link>
                </Button>

            </div>
        </>

    );

}

export default CarouselContainer