import { z } from "zod";
import UserSchema from "./userSchema";

const RemarkSchema = z.object({
  id: z.number().nullable().optional(),
  text: z.string().nullable().optional(),
  imagePath: z.string().nullable().optional(),
  user: UserSchema.nullable().optional(),
  likedByUsers: z.array(UserSchema).nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default RemarkSchema;
