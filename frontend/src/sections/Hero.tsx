"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import HomeProdCard from '../components/HomeProdCard';
import Link from "next/link";
import { useStoreContext } from '@/contexts/StoreContext'; // Import the context hook

const Hero = () => {
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
        <section id="home" className="w-full flex xl:flex-row flex-col justify-center max-h-full gap-10 max-container">
            <div className="relative xl:w-2/5 flex flex-col justify-start items-start w-full max-xl:padding-x pt-28">
                <h1 className="mt-2 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold">
                    <span className="xl:bg-transparent xl:whitespace-nowrap relative z-10 pr-10">{banner}</span>
                    <br />
                    <span style={{ color: accentColor }} className="inline-block mt-3">{name}</span>
                </h1>
                <p className="font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm">{banner_subtitle}</p>
                <div className='flex flex-row space-around gap-6'>
                    <Button onClick={handleShopNow} style={{backgroundColor: storeInfo.ui_accent_color}}>
                        Shop Now!
                    </Button>
                    <Button variant='ghost'>
                        <Link href='/products'>
                            See our social page
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="relative flex-1 flex justify-center items-center xl:min-h-full max-xl:py-40 bg-hero bg-cover bg-center" style={{ backgroundColor: ui_secondary_color }}>
                <img src={bigImage} alt="Shoe Collection" width={610} height={500} className="object-contain relative z-10 mt-[12rem] mb-[4rem]" />
                <div className="flex sm:gap-6 gap-4 absolute z-10 -bottom-[5%] sm:left-[10%] max-sm:px-6">
                    {ui_images.map((img:any) => (
                        <div key={img}>
                            <HomeProdCard
                                imgURL={img}
                                changeImage={() => setBigImage(img)}
                                bigImage={bigImage}
                                accentColor={accentColor}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
