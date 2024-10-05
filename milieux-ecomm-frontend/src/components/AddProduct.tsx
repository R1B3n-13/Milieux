"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreContext } from "@/contexts/StoreContext";
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
import uploadToCloudinary from "@/app/api/cloudinaryActions";

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

interface AddProductProps {
  refreshProducts: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ refreshProducts }) => {
  const { storeInfo, authToken } = useStoreContext();
  const ecommBackend = process.env.NEXT_PUBLIC_ECOMM_BACKEND_URL;
const PORT = ecommBackend ? ecommBackend : "http://localhost:8080/ecomm/api";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleImageUpdate();
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
  );
};

export default AddProduct;
