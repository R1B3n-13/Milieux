import { z } from "zod";
import UserSchema from "./userSchema";

const AiChatSessionSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().nullable().optional(),
  user: UserSchema.nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default AiChatSessionSchema;
