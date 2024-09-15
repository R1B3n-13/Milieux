"use client";

import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreContext } from '@/contexts/StoreContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Zod schema with number validation transformed to string for inputs
const formSchema = z.object({
  productName: z.string().min(2).max(50),
  productPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .transform((val) => parseFloat(val)),
  category: z.string().min(2).max(15),
  description: z.string().max(250),
  imgurl: z.string(),
});

interface AddProductProps {
  onProductAdded: (newProduct: any) => void; // Notify parent when a product is added
}

const AddProduct: React.FC<AddProductProps> = ({ onProductAdded }) => {
  const { storeInfo } = useStoreContext();
  const PORT = process.env.PORT || 'http://localhost:8081/api';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productPrice: "",
      category: "",
      description: "",
      imgurl: "",
    },
  });

  // Function to generate a random product ID
  const generateProductId = () => {
    return Math.floor(Math.random() * 1000000); // Adjust the range as needed
  };

  // Function to handle form submission and make the API call
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const newProduct = {
      id: generateProductId(),
      name: data.productName,
      price: data.productPrice,
      category: data.category,
      description: data.description,
      imgurl: data.imgurl,
      store_id: storeInfo.id, // Replace with dynamic store_id if needed
    };

    try {
      const response = await fetch(`${PORT}/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      // Notify parent about the new product
      onProductAdded(newProduct);

      // Optionally reset the form after submission
      form.reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="flex flex-row font-montserrat w-[30%]">
      <div className="flex flex-row gap-2 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2 w-[100%]"
          >
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Product name" type="text"/>
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
                  <FormLabel>Image URL:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Image URL" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-[10rem] bg-black text-white font-semibold hover:bg-gray-800">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
