'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStoreContext } from '@/contexts/StoreContext';
import { useRouter } from 'next/navigation';
import { set } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import AdminTopBar from '@/components/AdminTopBar';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Order {
    id: number;
    user_id: number;
    store_id: number;
    product_ids: number[];
    product_quantities: number[];
    address: string;
    timestamp: string;
    status: number; // Example: 0 = pending, 1 = shipped
}

const Orders = () => {
    const { storeInfo, loading } = useStoreContext();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [allOrders, setAllOrders] = useState(true);
    const [pendingOrders, setPendingOrders] = useState(false);
    const [shippedOrders, setShippedOrders] = useState(false);

    const PORT = process.env.PORT || 'http://localhost:8081/api';

    // Fetch orders for the store
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!storeInfo || !storeInfo.id) {
                    throw new Error("Store information not available");
                }
                const res = await fetch(`${PORT}/order/find/store/${storeInfo.id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data: Order[] = await res.json();
                setOrders(data);
                setFilteredOrders(data); // Initially show all orders
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchOrders();
    }, [storeInfo]);

    const handleShipment = async (orderId: number) => {
        console.log('orderId', orderId);
        
        try {
            const res = await fetch(`${PORT}/order/ship/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error('Failed to update order status');
            }
            const updatedOrders = orders.map(order => {
                if (order.id === orderId) {
                    return { ...order, status: 1 };
                }
                return order;
            });
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            handleFilter('shipped')
        } catch (err: any) {
            setError(err.message);
        }
    }

    // Filter orders based on status
    const handleFilter = (status: 'all' | 'pending' | 'shipped') => {
        if (status === 'all') {
            setFilteredOrders(orders);
            setAllOrders(true);
            setPendingOrders(false);
            setShippedOrders(false);
        } else if (status === 'pending') {
            setFilteredOrders(orders.filter(order => order.status === 0));
            setAllOrders(false);
            setPendingOrders(true);
            setShippedOrders(false);
        } else if (status === 'shipped') {
            setFilteredOrders(orders.filter(order => order.status === 1));
            setAllOrders(false);
            setPendingOrders(false);
            setShippedOrders(true);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className='flex flex-col items-center w-full'>

            <h1 className='font-bold text-2xl pb-5 pt-[-5rem]'>Orders</h1>
            <div className='flex flex-row justify-center border-gray-200 gap-2 items-center bg-gray-200 p-2 w-fit-content rounded-2xl px-2'>
                <Button
                    className='text-xl px-4 py-6 rounded-xl'
                    style={{ backgroundColor: allOrders ? '#FFFFFF' : 'transparent' }}
                    onClick={() => handleFilter('all')}
                >
                    All Orders
                </Button>
                <Button
                    className='text-xl px-4 py-6 rounded-xl'
                    style={{ backgroundColor: pendingOrders ? '#FFFFFF' : 'transparent' }}
                    onClick={() => handleFilter('pending')}
                >
                    Pending Orders
                </Button>
                <Button
                    className='text-xl px-4 py-6 rounded-xl'
                    style={{ backgroundColor: shippedOrders ? '#FFFFFF' : 'transparent' }}
                    onClick={() => handleFilter('shipped')}
                >
                    Shipped Orders
                </Button>
            </div>

            <div className='mt-6 w-[70%]'>
                {filteredOrders.length === 0 ? (
                    <p>No orders available.</p>
                ) : (
                    <ul className='space-y-4'>
                        {filteredOrders.map(order => (
                            <li key={order.id} className='p-4 bg-white shadow rounded'>
                                <div className='flex flex-row justify-between'>
                                    <div>
                                        <h3 className='font-bold'>Order #{order.id}</h3>
                                        <p>Status: {order.status === 0 ? 'Pending' : 'Shipped'}</p>
                                        <p>Address: {order.address}</p>
                                        <p>Products: {order.product_ids.join(', ')}</p>
                                        <p>Quantities: {order.product_quantities.join(', ')}</p>
                                        <p>Timestamp: {new Date(order.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div className='flex flex-col gap-2 w-[15%]'>
                                        <Button className='border-gray-200 bg-white border-[1px] hover:bg-gray-200'> Details </Button>
                                        {order.status === 0 && (<Button onClick={() => handleShipment(order.id)} className='border-gray-200 bg-white border-[1px] hover:bg-gray-200'> Ship </Button>)}
                                        
                                        {order.status === 0 && (<Button variant='destructive'> Cancel </Button>)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

    );
};

export default Orders;
