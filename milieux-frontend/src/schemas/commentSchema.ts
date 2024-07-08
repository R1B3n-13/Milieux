import { z } from "zod";

const CommentSchema = z
  .object({
    id: z.number().optional(),
    text: z.string().optional(),
    imagePath: z.string().optional(),
    ownerId: z.number().optional(),
    ownerName: z.string().optional(),
    postId: z.number().optional(),
    likedByUsers: z.array(z.any()).optional(),
    createdAt: z.string().datetime().optional(),
  })
  .refine(
    (data) =>
      (data.text !== undefined && data.text !== "") ||
      (data.imagePath !== undefined && data.imagePath !== ""),
    {
      message: "Empty comment is not allowed",
      path: ["text"],
    }
  );

export default CommentSchema;
