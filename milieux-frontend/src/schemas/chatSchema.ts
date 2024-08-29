import { z } from "zod";
import UserSchema from "./userSchema";

const ChatSchema = z.object({
  id: z.number().nullable().optional(),
  users: z.array(UserSchema).nullable().optional(),
  lastText: z.string().nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default ChatSchema;
