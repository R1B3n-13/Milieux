import { z } from "zod";
import CommentSchema from "./commentSchema";
import UserSchema from "./userSchema";

const PostSchema = z.object({
  id: z.number().nullable().optional(),
  text: z.string().nullable().optional(),
  imagePath: z.string().url().nullable().optional(),
  videoPath: z.string().url().nullable().optional(),
  user: UserSchema.nullable().optional(),
  likedByUsers: z.array(UserSchema).nullable().optional(),
  comments: z.array(CommentSchema).nullable().optional(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

export default PostSchema;
