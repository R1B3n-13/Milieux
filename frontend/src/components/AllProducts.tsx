import React from 'react'
import Image from 'next/image';
import { products } from '@/constants'; // Import your products array

const AllProducts = () => {
    return (
        <div className='flex flex-col w-[70%] gap-4'>
            {
                products.map(product =>
                    <li key={product.id} className='list-none'>
                        <div className='flex flex-row gap-2 px-5 h-20 items-center justify-between w-full max-w-[700px] rounded-xl border-[1px] border-slate-200'>
                            <div className='flex gap-2 items-center'>
                                <p className='text-slate-400 pr-2'>{product.id}</p>
                                <Image src={product.imgURL} alt={product.name} width={40} height={40}/>
                                {product.name}
                            </div>
                            <div className='flex items-center'>
                                {product.price}
                            </div>
                            <div>remove</div>
                        </div>
                    </li>
                )
            }
        </div>
    )
}

export default AllProducts