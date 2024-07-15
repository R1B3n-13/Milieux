import { z } from "zod";
import RemarkSchema from "./remarkSchema";
import UserSchema from "./userSchema";

const PostSchema = z.object({
  id: z.number().nullable().optional(),
  text: z.string().nullable().optional(),
  imagePath: z.string().url().nullable().optional(),
  videoPath: z.string().url().nullable().optional(),
  tidbits: z.string().nullable().optional(),
  isSafe: z.boolean().optional().nullable(),
  user: UserSchema.nullable().optional(),
  likedByUsers: z.array(UserSchema).nullable().optional(),
  comments: z.array(RemarkSchema).nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default PostSchema;
