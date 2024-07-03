import { z } from "zod";

const PostSchema = z
  .object({
    id: z.number(),
    caption: z.string().nullable(),
    imagePath: z.string().url().nullable(),
    videoPath: z.string().url().nullable(),
    ownerId: z.number(),
    ownerName: z.string(),
    likedByUsers: z.array(z.any()),
    comments: z.array(z.any()),
    createdAt: z.string().transform((str) => new Date(str)),
  })
  .refine(
    (data) =>
      data.caption !== null ||
      data.imagePath !== null ||
      data.videoPath !== null,
    {
      message: "At least one of caption, image, or video must be provided",
    }
  );

export default PostSchema;
