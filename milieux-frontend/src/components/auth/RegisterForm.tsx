"use client";

import CardWrapper from "@/components/auth/CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { RegisterSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { useState } from "react";
import sequentialResolver from "@/lib/sequentialResolver";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import categoryItems from "./items/categoryItems";
import { registerUser } from "@/actions/authActions";
import Loading from "../common/Loading";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [otherCategory, setOtherCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: async (values, context, options) => {
      const zodResult = await zodResolver(RegisterSchema)(
        values,
        context,
        options
      );
      const sequentialResult = await sequentialResolver(RegisterSchema)(
        values,
        context,
        options
      );
      return sequentialResult.errors ? sequentialResult : zodResult;
    },
    defaultValues: {
      isBusiness: false,
      name: "",
      email: "",
      userType: {
        gender: "",
        category: "",
      },
      password: "",
      confirmPassword: "",
    },
  });

  const handleTabChange = (tab: string) => {
    const isBusiness = tab === "business";
    form.reset({
      isBusiness,
      name: "",
      email: "",
      userType: {
        gender: "",
        category: "",
      },
      password: "",
      confirmPassword: "",
    });
  };

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true);

    const response = await registerUser(data);

    if (response.error) {
      toast.error(response.error);
    } else if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push("/login");
    }

    setIsLoading(false);
  };

  return (
    <CardWrapper
      label="Create an account"
      title="Register"
      backButtonHref="/login"
      backButtonLabel="Already have an account? Login here."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            defaultValue="casual"
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="casual">Casual</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="casual">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="e.g. johndoe@gmail.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userType.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-5"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="r1" />
                            <Label htmlFor="r1">Male</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="r2" />
                            <Label htmlFor="r2">Female</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="r3" />
                            <Label htmlFor="r3">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="business">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="e.g. johndoe@gmail.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userType.category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            if (value !== "other") {
                              setSelectedCategory(value);
                              setOtherCategory("");
                              field.onChange(value);
                            } else {
                              setSelectedCategory("other");
                              field.onChange(otherCategory);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category">
                              {selectedCategory !== "other"
                                ? field.value
                                : otherCategory}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="flex items-center justify-center gap-2 mt-1 mr-1">
                              <SelectItem value="other" className="w-1/5">
                                Other
                              </SelectItem>
                              <Input
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setOtherCategory(value);
                                  field.onChange(value);
                                }}
                                disabled={selectedCategory !== "other"}
                                className="w-full"
                                placeholder="Please specify..."
                              />
                            </SelectGroup>

                            <SelectGroup>
                              {categoryItems.map((category) => (
                                <SelectItem value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loading text="Loading..." /> : "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
