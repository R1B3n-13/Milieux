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
    comments: z.array(z.any()).optional(),
    createdAt: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
  })
  .refine(
    (data) =>
      data.text !== undefined ||
      data.imagePath !== undefined ||
      data.videoPath !== undefined,
    {
      message: "At least one of caption, image, or video must be provided",
      path: ["text"],
    }
  );

export default PostSchema;
