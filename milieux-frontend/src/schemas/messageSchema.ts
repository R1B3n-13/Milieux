import { z } from "zod";
import UserSchema from "./userSchema";
import ChatSchema from "./chatSchema";

const MessageSchema = z.object({
  id: z.number().nullable().optional(),
  user: UserSchema.nullable().optional(),
  chat: ChatSchema.nullable().optional(),
  text: z.string().nullable().optional(),
  imagePath: z.string().nullable().optional(),
  timestamp: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default MessageSchema;
