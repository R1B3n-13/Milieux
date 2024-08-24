'use client'

import React from 'react'
import {
    Card,
    CardContent
} from "@/components/ui/card"
import Image from 'next/image'
import star from '@/assets/icons/star.svg'


interface ProductCardProps {
    imgurl: string;
    name: string;
    price: number;
    accentColor: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ imgurl, name, price, accentColor }) => {
    
    return (
        <Card className='flex flex-1 items-center flex-col w-full max-sm:w-full py-8 rounded-2xl'>
            <CardContent>
                <Image src={imgurl} alt={name} width={280} height={280} className='w-[280px] h-[280px]' />
                <div className='mt-8 flex justify-start gap-2.5'>
                    <Image src={star} alt='rating' width={24} height={24} />
                    <p className='font-montserrat text-xl leading-normal text-slate-gray'>{4.5}</p>
                </div>

                <h3 className='mt-2 text-2xl leading-normal font-semibold font-palanquin'>{name}</h3>
                <p className='mt-2 font-semibold font-montserrat leading-normal' style={{color: accentColor}}>{price}</p>
            </CardContent>
        </Card>
    )
}

export default ProductCard
