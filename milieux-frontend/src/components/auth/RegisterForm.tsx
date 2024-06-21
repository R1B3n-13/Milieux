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
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import sequentialResolver from "@/lib/sequentialResolver";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Label } from "@/components/ui/Label";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: async (values, context, options) => {
      const zodPromise = zodResolver(RegisterSchema)(values, context, options);

      const sequentialPromise = sequentialResolver(RegisterSchema)(
        values,
        context,
        options
      );

      const [zodResult, sequentialResult] = await Promise.all([
        zodPromise,
        sequentialPromise,
      ]);

      return sequentialResult.errors ? sequentialResult : zodResult;
    },

    defaultValues: {
      name: "",
      email: "",
      gender: "male",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    console.log(data);
  };

  const { pending } = useFormStatus();

  return (
    <CardWrapper
      label="Create an account"
      title="Register"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account? Login here."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue="male"
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="********" />
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
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
