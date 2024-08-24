"use client"

import { useState } from 'react';
import Image from 'next/image';
import { headerLogo } from '@/assets/images';
import { Button } from '@/components/ui/button';
import AddProduct from '@/components/addProduct';
import AllProducts from '@/components/AllProducts';

const Admin: React.FC = () => {
    const [isAddItemClicked, setIsAddItemClicked] = useState(false);
    const [showAllItems, setShowAllItems] = useState(false);

    const handleAddItemClick = () => {
        setIsAddItemClicked(!isAddItemClicked);
    };

    const handleShowItems = () => {
        setShowAllItems(!showAllItems);
    };

    return (
        <div className="flex flex-col px-10">
            <div className="flex flex-row w-full rounded py-10 font-montserrat">
                <div className="w-[40rem]">
                    <div className="text-2xl">Admin Panel</div>
                    <div className="pt-5 text-xl">Shop Name</div>
                </div>
                <Image src={headerLogo} alt="header logo" height={400} width={400} />
            </div>

            <div className='w-full pt-10 flex gap-12 justify-start'>
                <div className='text-3xl'>Add a Product</div>

                <div className='text-3xl'>Current Products</div>
            </div>
            <hr className='border-black' />

            <div className='flex flex-row gap-5 py-10 '>
                <AddProduct />
                <AllProducts />
            </div>

        </div>
    );
};

export default Admin;
