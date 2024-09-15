'use client';

import React, { useState } from 'react';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { Button } from '@/components/ui/button';
import { time, timeStamp } from 'console';

const Orders: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useShoppingCart(); // Added clearCart function
    const [orderPlaced, setOrderPlaced] = useState(false);

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
    };

    const placeOrder = async () => {
        try {
            const orderId = Math.floor(Math.random() * 1000); // Generate a random order ID
            const orderData = {
                id: orderId,
                user_id: 1, // Replace with actual user ID if necessary
                store_id: 1, // Replace with the correct store ID
                product_ids: cart.map((product) => product.id),
                product_quantities: cart.map((product) => product.quantity),
                address: "123 Main St", // Replace with the user's actual address
                timestamp: new Date().toISOString(), // Add the current timestamp
                status: 0, // Set an initial status for the order
            };

            const response = await fetch('http://localhost:8081/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                console.log('Order placed:', cart);
                setOrderPlaced(true);
                clearCart(); // Clear the cart after the order is placed
            } else {
                console.error('Failed to place the order');
            }
        } catch (error) {
            console.error('Error placing the order:', error);
        }
    };

    if (orderPlaced) {
        return (
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
                <p>Your order has been placed successfully.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty. Add items to proceed with an order.</p>
            ) : (
                <div className="space-y-6">
                    {cart.map((product) => (
                        <div key={product.id} className="flex items-center space-x-4 bg-white p-4 shadow rounded">
                            <img
                                src={product.imageSrc}
                                alt={product.imageAlt}
                                className="w-24 h-24 object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="text-gray-500 hover:text-gray-600"
                                    onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                    disabled={product.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{product.quantity}</span>
                                <button
                                    className="text-gray-500 hover:text-gray-600"
                                    onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="ml-4">
                                <Button onClick={() => removeFromCart(product.id)} variant="ghost">
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
                        <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>
                        <Button className="bg-green-600 text-white" onClick={placeOrder}>
                            Place Order
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
