import { z } from "zod";
import UserSchema from "./userSchema";

const FlashSchema = z.object({
  id: z.number().nullable().optional(),
  imagePath: z.string().url().nullable().optional(),
  videoPath: z.string().url().nullable().optional(),
  user: UserSchema.nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default FlashSchema;
