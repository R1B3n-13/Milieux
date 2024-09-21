import React from 'react'
import { Card } from './ui/card'
import Link from 'next/link'

const AdminSidebar = () => {
    return (
        <>
            <Card className='flex flex-col justify-start items-start gap-5 border-0 shadow-none w-max font-normal text-xl'>
                <Link href={'/admin'} className='p-2 border-1 border-gray-200 bg-white rounded-md w-[100%]'>
                    Home
                </Link>
                <Link href={'/admin/products'} className='p-2 border-1 border-gray-200 bg-white rounded-md w-[100%]'>
                    Manage Products
                </Link>
                <Link href={'/admin/orders'} className='p-2 border-1 border-gray-200 bg-white rounded-md w-[100%]'>
                    Manage Orders
                </Link>
                <Link href={'/admin/products'} className='p-2 border-1 border-gray-200 bg-white rounded-md w-[100%]'>
                    Customize Shop
                </Link>
            </Card>
        </>
    )
}

export default AdminSidebar