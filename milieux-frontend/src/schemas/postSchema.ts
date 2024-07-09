import { z } from "zod";
import CommentSchema from "./commentSchema";
import UserSchema from "./userSchema";

const PostSchema = z
  .object({
    id: z.number().optional(),
    text: z.string().optional(),
    imagePath: z.string().url().optional(),
    videoPath: z.string().url().optional(),
    user: UserSchema.optional(),
    likedByUsers: z.array(UserSchema).optional(),
    comments: z.array(CommentSchema).optional(),
    createdAt: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
  })
  .refine(
    (data) =>
      (data.text !== undefined && data.text !== "") ||
      (data.imagePath !== undefined && data.imagePath !== "") ||
      (data.videoPath !== undefined && data.videoPath !== ""),
    {
      message: "Empty post is not allowed",
      path: ["text"],
    }
  );

export default PostSchema;
