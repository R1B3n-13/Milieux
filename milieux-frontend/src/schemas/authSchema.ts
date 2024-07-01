import { z } from "zod";

export const RegisterSchema = z
  .object({
    isBusiness: z.boolean({
      required_error: "isBusiness is required",
      invalid_type_error: "isBusiness must be a boolean",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    userType: z.object({
      gender: z.string().optional(),
      category: z.string().optional(),
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }

    if (data.isBusiness && !data.userType.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category must be provided",
        path: ["userType.category"],
      });
    }

    if (!data.isBusiness && !data.userType.gender) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select your gender",
        path: ["userType.gender"],
      });
    }

    return true;
  });

export const LoginSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  })
  .refine(() => {
    return true;
  });
