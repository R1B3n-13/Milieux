import { z } from "zod";

const UserSchema = z.object({
  id: z.number().nullable().optional(),
  isBusiness: z.boolean().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  dp: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  intro: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  userType: z.any().nullable().optional(),
  followers: z.array(z.any()).nullable().optional(),
  followings: z.array(z.any()).nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default UserSchema;
