'use client'

import { useStoreContext } from '@/contexts/StoreContext';
import React, { useState } from 'react'
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const UpdateFeatured = () => {
    
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <div className='flex flex-col gap-2 w-ful'>
                
                <div className='flex justify-center items-center gap-2'>
                    <Button className='w-[10%] h-fit bg-black text-white hover:bg-gray-800 hover:text-white' variant={'ghost'}>
                        Submit
                    </Button>
                </div>
            </div>
        </>
  )
}

export default UpdateFeatured
