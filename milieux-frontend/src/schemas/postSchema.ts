import { z } from "zod";

const PostSchema = z
  .object({
    id: z.number().optional(),
    caption: z.string().optional(),
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
      data.caption !== undefined ||
      data.imagePath !== undefined ||
      data.videoPath !== undefined,
    {
      message: "At least one of caption, image, or video must be provided",
      path: ["caption"],
    }
  );

export default PostSchema;
