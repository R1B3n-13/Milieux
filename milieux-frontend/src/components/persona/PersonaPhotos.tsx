import PostSchema from "@/schemas/postSchema";
import { getPostsByUserId, getSavedPosts } from "@/services/postService";
import { getUserFromAuthToken } from "@/services/userService";
import { z } from "zod";
import PostCard from "../common/PostCard";
import Image from "next/image";

const PersonaPostList = async ({ id }: { id: number | null }) => {
  const savedPostResponsePromise = getSavedPosts();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [savedPostResponse, loggedInUserResponse] = await Promise.all([
    savedPostResponsePromise,
    loggedInUserResponsePromise,
  ]);

  let posts: z.infer<typeof PostSchema>[] = [];

  if (!id && loggedInUserResponse.success) {
    const postResponse = await getPostsByUserId(loggedInUserResponse.user.id);
    if (postResponse.success) {
      posts = postResponse.posts;
    }
  } else {
    const postResponse = await getPostsByUserId(id);
    if (postResponse.success) {
      posts = postResponse.posts;
    }
  }

  const photos = posts
    .filter((post) => post.imagePath)
    .map((post) => post.imagePath);

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="w-full h-48">
            <Image
              src={photo || ""}
              alt={`image-${index}`}
              width={500}
              height={500}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PersonaPostList;
