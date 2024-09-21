"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define validation schema using Zod
const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(4, "Postal code must be at least 5 characters"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface OrderFormProps {
  onAddressSubmit: (address: AddressFormValues) => void; // Updated typing for onAddressSubmit
}

const OrderForm: React.FC<OrderFormProps> = ({ onAddressSubmit }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const handleSubmit = (values: AddressFormValues) => {
    if (showAddressForm) {
      onAddressSubmit(values); // Send the address data to parent
    }
  };

  return (
    <div className="w-full optional-address mt-6">
      <h3 className="text-lg font-semibold">Would you like to provide a shipping address?</h3>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="address-toggle"
          checked={showAddressForm}
          onCheckedChange={(checked) => setShowAddressForm(!!checked)}
        />
        <label htmlFor="address-toggle">Yes, I want to provide a shipping address.</label>
      </div>

      {showAddressForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-[75%] space-y-4 mt-4">
            <FormField
              name="street"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="state"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="postalCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant={'ghost'} 
            className="w-fit m-10 border-[1.5px] border-gray-200 hover:bg-black hover:text-white">
              Submit Address
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default OrderForm;
