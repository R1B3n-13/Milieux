"use client";


import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import uploadToCloudinary from "@/app/api/cloudinaryActions";
import { Separator } from "../ui/separator";

import Image from "next/image";
import { useStoreContext } from "@/contexts/StoreContext";

const formSchema = z.object({
    productName: z.string().min(2).max(50),
    productPrice: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
        .transform((val: any) => parseFloat(val)),
    category: z.string().min(2).max(15),
    description: z.string().max(250).optional(),
    imgurl: z.string().optional(),
});


interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    imgurl: string;
    store_id: number;
}


const CustomizeProducts = () => {

    const { storeInfo, authToken } = useStoreContext();
    const PORT = process.env.ECOMM_BACKEND_URL || "http://localhost:8082/api";
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        if (storeInfo) {
            fetchProducts(storeInfo.id);
        }
    }, [storeInfo]);


    const fetchProducts = useCallback(
        async (store_id: number) => {
            setLoading(true);
            try {
                const response = await fetch(`${PORT}/product/store/${store_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    cache: "no-cache",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data: Product[] = await response.json();
                setProducts(data); // Update the product list
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        },
        [PORT]
    );

    const handleRemoveProduct = async (productId: number) => {
        try {
            const response = await fetch(`${PORT}/product/delete/${productId}`, {
                method: "Delete",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                cache: "no-cache",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", response.status, errorData);
                throw new Error("Failed to delete product");
            }

            await fetchProducts(storeInfo.id); // Refresh products locally
            refreshProducts(); // Call refreshProducts to trigger external refresh
        } catch (error) {
            console.error("Error removing product:", error);
            setError("Failed to remove product");
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            productPrice: 0,
            category: "",
            description: "",
            imgurl: "",
        },
    });

    const refreshProducts = () => {
        console.log("refreshProducts called"); // Add this log to ensure the function is invoked
        // setShowAllItems(false); // Temporarily hide AllProducts
        setTimeout(() => {
            console.log("Re-displaying AllProducts");
            fetchProducts(storeInfo.id);
        }, 1);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // handleImageUpdate();
        }
    };

    const handleImageUpdate = async () => {
        if (!selectedFile) return null; // No file selected

        try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);

            return new Promise<string>((resolve, reject) => {
                fileReader.onload = async () => {
                    const fileBase64 = fileReader.result as string;
                    const { success, url } = await uploadToCloudinary(
                        fileBase64,
                        "image"
                    );

                    if (success) {
                        console.log("Image uploaded:", url);
                        resolve(url || "");
                    } else {
                        reject(new Error("Image upload failed"));
                    }
                };

                fileReader.onerror = () => {
                    reject(new Error("Error reading file"));
                };
            });
        } catch (error: any) {
            setError(error.message || "Failed to update store UI");
            console.error("Error updating store UI:", error);
            return null;
        }
    };

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null); // Reset any previous error

        const imgUrl = await handleImageUpdate();
        if (!imgUrl) return; // Exit if image upload failed

        const newProduct = {
            id: Math.floor(Math.random() * 1000),
            name: data.productName,
            price: data.productPrice,
            category: data.category,
            description: data.description,
            imgurl: imgUrl, // Use the uploaded image URL
            store_id: storeInfo.id,
        };

        try {
            const response = await fetch(`${PORT}/product/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
            }

            refreshProducts();
            form.reset();
            setSelectedFile(null); // Reset the file input
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <>
            <div className="flex gap-5 w-full px-5">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-2 w-[40%] ml-10"
                    >
                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name:</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Product name" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="productPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price:</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Price" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category:</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Category" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional):</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Description"
                                            type="text"
                                            className="h-[100px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imgurl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image:</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full border-[1.5px] border-gray-200 focus:border-none"
                                            placeholder={
                                                selectedFile ? selectedFile.name : "Upload Image"
                                            }
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-[10rem] bg-black text-white font-semibold hover:bg-gray-800"
                        >
                            Submit
                        </Button>

                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </Form>
                <Separator
                    orientation="vertical"
                    className="border-1 border-gray-600"
                />

                <div className="flex flex-col w-full gap-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <li key={product.id} className="list-none">
                                <div className="flex flex-row gap-2 px-5 h-20 items-center justify-evenly w-full rounded-xl border-[1px] border-slate-200">
                                    <div>
                                        <p className="text-slate-400 pr-2">{product.id}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            src={product.imgurl}
                                            alt={product.name}
                                            width={40}
                                            height={40}
                                        />
                                        {product.name}
                                    </div>
                                    <div className="flex items-center">${product.price}</div>
                                    <div>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleRemoveProduct(product.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>

            </div>
        </>
    )
}

export default CustomizeProducts