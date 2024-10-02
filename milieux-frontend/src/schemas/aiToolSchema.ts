import { z } from "zod";
import UserSchema from "./userSchema";

const AiToolSchema = z.object({
  id: z.number().nullable().optional(),
  fileData: z.instanceof(Blob).nullable().optional(),
  currentFileName: z.string().nullable().optional(),
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

export default AiToolSchema;
