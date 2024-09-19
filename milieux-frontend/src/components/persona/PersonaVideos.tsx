import PostSchema from "@/schemas/postSchema";
import { getPostsByUserId, getSavedPosts } from "@/services/postService";
import { getUserFromAuthToken } from "@/services/userService";
import { z } from "zod";
import PostCard from "../common/PostCard";

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

  const videos = posts.filter((post) => post.videoPath);

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <>
      {videos.map((post: z.infer<typeof PostSchema>) => (
        <div key={post.id} className="w-full">
          <PostCard
            post={post}
            userId={loggedInUserResponse.user.id}
            isSaved={savedPostSet.has(post.id)}
          />
        </div>
      ))}
    </>
  );
};

export default PersonaPostList;
