import { z } from "zod";
import UserSchema from "./userSchema";

const AiChatParamsSchema = z.object({
  id: z.number().nullable().optional(),
  currentPdfName: z.string().nullable().optional(),
  temperature: z.number().nullable().optional(),
  topP: z.number().nullable().optional(),
  topK: z.number().nullable().optional(),
  systemInstruction: z.string().nullable().optional(),
  user: UserSchema.nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default AiChatParamsSchema;
