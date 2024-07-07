import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  isBusiness: z.boolean(),
  name: z.string(),
  email: z.string().email(),
  userType: z.any(),
  followers: z.array(z.unknown()),
  followings: z.array(z.unknown()),
  createdAt: z.string().datetime(),
});

export default UserSchema;
