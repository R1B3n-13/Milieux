'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import HomeProdCard from '../components/HomeProdCard';
import Link from "next/link";
import { useStoreContext } from '@/contexts/StoreContext'; // Import the context hook
import UpdateFromHome from "@/components/Customization/UpdateFromHome";

const Hero = () => {
    const router = useRouter();
    const { storeInfo, loggedInUserId } = useStoreContext();

    if (!storeInfo) {
        return <p>Loading store info...</p>;
    }

    const banner = storeInfo.banner;
    const accentColor = storeInfo.ui_accent_color;
    const ui_secondary_color = storeInfo.ui_secondary_color;
    const name = storeInfo.name;
    const banner_subtitle = storeInfo.banner_subtext;

    const defaultImages = ['https://placehold.co/600x400/png', 'https://placehold.co/600x400/png'];

    const [ui_images, setUi_images] = useState<string[]>(storeInfo.ui_images?.length ? storeInfo.ui_images : defaultImages);
    const [bigImage, setBigImage] = useState(ui_images[0]);

    useEffect(() => {
        if (storeInfo.ui_images && storeInfo.ui_images.length > 0) {
            setUi_images(storeInfo.ui_images);
            setBigImage(storeInfo.ui_images[0]);
        }
    }, [storeInfo.ui_images]);

    return (
        <>
            <section id="home" className="w-full flex xl:flex-row flex-col justify-center h-[800px] gap-10 max-container">
                <div className="relative xl:w-2/5 flex flex-col justify-start items-start w-full max-xl:padding-x pt-28">
                    <h1 className="mt-2 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold">
                        <span className="xl:bg-transparent xl:whitespace-nowrap relative z-10 pr-10">{banner}</span>
                        <br />
                        <span style={{ color: accentColor }} className="inline-block mt-3">{name}</span>
                    </h1>
                    <p className="font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm">{banner_subtitle}</p>
                    <div className='flex flex-row space-around gap-6'>
                        <Button style={{ backgroundColor: storeInfo.ui_accent_color }}>
                            <Link href='/products'>
                                Shop Now!
                            </Link>
                        </Button>
                        <Button variant='ghost'>
                            <Link href='/products'>
                                See our social page
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative flex-1 flex justify-center items-center xl:min-h-full max-xl:py-40 bg-hero bg-cover bg-center" style={{ backgroundColor: ui_secondary_color }}>

                    <div className="relative w-full pt-12 h-[500px] flex justify-center items-center">
                        <img
                            src={bigImage}
                            alt="Shoe Collection"
                            className="object-contain h-full max-w-full"
                        />
                    </div>
                    <div className="flex sm:gap-6 gap-4 absolute z-10 -bottom-[5%] sm:left-[10%] max-sm:px-6">
                        {ui_images.map((img: string) => (
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
            {loggedInUserId === storeInfo.id &&
                <div className="pt-12">
                    <UpdateFromHome />
                </div>
            }
        </>
    );
};

export default Hero;
