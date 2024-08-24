import { products } from '@/constants';
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const ProductPage = ({ params }) => {
    const { id } = params;
    var ind = 1
    const productInfo = products.map((product) => {
        if (product.id === id)  {
            console.log(product);
            return product
        }
    })

    console.log(productInfo);
    
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-center w-full gap-12 py-[100px]'>
                
                <Image src={productInfo[id-1]?.imgURL} alt="product image" height={500} width={500} className=''></Image>
                
                <div className='flex flex-col gap-2 font-montserrat w-[650px]'>
                    
                    <p className='text-4xl text-blue-900 font-semibold'>{productInfo[id-1]?.name}</p>
                    <p className='font-bold text-xl'> {productInfo[id-1]?.price} </p>
                    <p>{productInfo[id-1]?.desciption}</p>

                    <div className='flex gap-2 w-full'>
                        <Button variant='outline' className='bg-blue-900 text-white font-bold my-4 w-1/5 hover:bg-blue-700 hover:text-white'>Buy Now!</Button>
                        <Button variant='ghost' className='bg-gray-200 text-black font-bold my-4 w-1/5 hover:bg-gray-300'>Add to cart</Button>
                    </div>

                    <div className='flex gap-2 w-full'>
                        <h3 className='font-semibold text-2xl'>Reviews</h3>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProductPage