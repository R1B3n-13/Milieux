import { z } from "zod";

const FeedSchema = z.object({
  thumbnail: z.string(),
  title: z.string(),
  publishDate: z.string(),
});

export default FeedSchema;
