"use client"

import { shoes, statistics } from '../constants'
import { bigShoe1 } from "../assets/images"
import ShoeCard from "../components/HomeProdCard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import HomeProdCard from '../components/HomeProdCard'

const Hero = ({storeInfo}) => {

    const banner = storeInfo.banner
    const accentColor = storeInfo.ui_accent_color
    const name = storeInfo.name
    const ui_images = storeInfo.ui_images
    
    const [bigImage, setBigImage] = useState(ui_images[0])
    console.log(ui_images);
    

    return (
        <section id="home" className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container">

            <div className="relative xl:w-2/5 flex flex-col justify-center items-start w-full  max-xl:padding-x pt-28">
                <h1 className="mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold">
                    <span className="xl:bg-transparent xl:whitespace-nowrap relative z-10 pr-10">{banner}</span>
                    <br />
                    <span style={{color: accentColor}} className="inline-block mt-3">{name}</span> Shoes
                </h1>
                <p className="font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab suscipit possimus nesciunt ad, soluta neque iure eius earum perspiciatis autem dolores. Maxime accusamus iure labore natus et perspiciatis soluta veniam.</p>
                <div className='flex flex-row space-around gap-6'>
                <Button>
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
                <div className="flex justify-starts items-start flex-wrap w-full mt-20 gap-16">
                    {statistics.map((stat, index) => (
                        <div key={index}>
                            <p className="text-4xl font-palanquin font-bold">{stat.value}</p>
                            <p className="leading-7 font-montserrat text-slate-gray">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-primary bg-hero bg-cover bg-center">
                <img src={bigImage} alt="Shoe Collection" width={610} height={500} className="object-contain relative z-10" />

                <div className="flex sm:gap-6 gap-4 absolute z-10 -bottom-[5%] sm:left-[10%] max-sm:px-6">
                    {ui_images.map((img) => (
                        <div key={img}>
                            <HomeProdCard
                                imgURL={img}
                                changeImage={(bigImage) => {
                                    setBigImage(img)
                                }}
                                bigImage={bigImage}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default Hero