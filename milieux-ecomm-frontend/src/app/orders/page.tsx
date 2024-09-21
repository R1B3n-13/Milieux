"use client";

import React, { useState } from "react";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { Button } from "@/components/ui/button";
import { useStoreContext } from "@/contexts/StoreContext";
import Link from "next/link";
import OrderForm from "@/components/OrderForm";

const Orders: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useShoppingCart(); // Added clearCart function
    const [orderPlaced, setOrderPlaced] = useState(false);
    const { storeInfo, loggedInUserId, loggedUserInfo } = useStoreContext();
    const [address, setAddress] = useState<String>(""); // State to store address

    const calculateTotal = () => {
        return cart
            .reduce((total, product) => total + product.price * product.quantity, 0)
            .toFixed(2);
    };

    const handleAddressSubmit = (address: any) => {
        // Combine the address fields into a formatted string
        const formattedAddress = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}`;

        console.log("Address submitted:", formattedAddress);

        setAddress(formattedAddress); // Store the formatted address in the parent component state
    };


    const placeOrder = async () => {
        try {
            const orderId = Math.floor(Math.random() * 1000); // random order ID
            const orderData = {
                id: orderId,
                user_id: loggedInUserId,
                store_id: storeInfo.id,
                product_ids: cart.map((product) => product.id),
                product_quantities: cart.map((product) => product.quantity),
                address: address || loggedUserInfo.address, // Use provided address or logged-in user address
                timestamp: new Date().toISOString(),
                status: 0,
            };

            const response = await fetch("http://localhost:8081/api/order/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                console.log("Order placed:", cart);
                setOrderPlaced(true);
                clearCart(); // Clear the cart after the order is placed
            } else {
                console.error("Failed to place the order");
            }
        } catch (error) {
            console.error("Error placing the order:", error);
        }
    };

    if (orderPlaced) {
        return (
            <div className="flex flex-col container mx-auto p-6 w-full h-full">
                <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
                <p>Your order has been placed successfully.</p>
                <Button className="w-fit m-10 border-[1.5px] border-gray-200 hover:bg-black hover:text-white" variant={"ghost"}>
                    <Link href={"/"}>Back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="container mx-auto p-6">
                    <h2 className="text-2xl font-bold mb-4 pt-10">Your Orders</h2>

                    {cart.length === 0 ? (
                        <div className="flex flex-col justify-center items-center container mx-auto p-6 w-full h-[550px]">
                            <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
                            <p>Add items to proceed with an order</p>
                            <Button className="w-fit m-10 border-[1.5px] border-gray-200 hover:bg-black hover:text-white" variant={"ghost"}>
                                <Link href={"/"}>Back to Home</Link>
                            </Button>
                        </div>
                    ) : (

                        <div className="flex flex-col gap-10 pt-5">
                            <div className="flex gap-10 space-y-6">
                                {cart.map((product) => (
                                    <div key={product.id} className="flex w-[80%] h-fit items-center space-x-4 bg-white p-4 shadow rounded">
                                        <img src={product.imageSrc} alt={product.imageAlt} className="w-24 h-24 object-cover" />
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
                                            <button className="text-gray-500 hover:text-gray-600" onClick={() => updateQuantity(product.id, product.quantity + 1)}>
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

                                <OrderForm onAddressSubmit={handleAddressSubmit} />
                            </div>
                            <div className="flex w-[90%] justify-between items-center bg-gray-100 p-4 rounded">
                                <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>
                                <Button className="bg-green-600 text-white hover:bg-green-500" onClick={placeOrder}>
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Orders;
