"use client";

import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  imgURL: z.string().url("Invalid URL"),
});

const AddProduct = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productPrice: "",
      category: "",
      description: "",
      imgURL: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data: ", data);
  };

  return (
    <div className="flex flex-row font-montserrat">
      <div className="flex flex-row gap-2 max-w-64 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2 max-w-md w-[100%]"
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
              name="imgURL"
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
