import { z } from "zod";

const FeedSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  pubDate: z.string(),
  thumbnail: z.string().url().nullable(),
});

export default FeedSchema;
