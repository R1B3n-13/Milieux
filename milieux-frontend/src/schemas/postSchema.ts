import { z } from "zod";

const PostSchema = z
  .object({
    id: z.number().optional(),
    text: z.string().optional(),
    imagePath: z.string().url().optional(),
    videoPath: z.string().url().optional(),
    ownerId: z.number().optional(),
    ownerName: z.string().optional(),
    likedByUsers: z.array(z.any()).optional(),
    totalComments: z.number().optional(),
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
