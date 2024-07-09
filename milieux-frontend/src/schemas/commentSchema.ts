import { z } from "zod";
import UserSchema from "./userSchema";

const CommentSchema = z
  .object({
    id: z.number().optional(),
    text: z.string().optional(),
    imagePath: z.string().optional(),
    user: UserSchema.optional(),
    likedByUsers: z.array(UserSchema).optional(),
    createdAt: z.string().datetime().optional(),
  })
  .refine(
    (data) =>
      (data.text !== undefined && data.text !== "") ||
      (data.imagePath !== undefined && data.imagePath !== ""),
    {
      message: "Empty remark is not allowed",
      path: ["text"],
    }
  );

export default CommentSchema;
