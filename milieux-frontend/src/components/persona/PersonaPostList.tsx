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

  let postResponse = [];

  if (loggedInUserResponse.success) {
    if (!id) {
      postResponse = await getPostsByUserId(loggedInUserResponse.user.id);
    } else {
      postResponse = await getPostsByUserId(id);
    }
  }

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <div>
      {postResponse.success &&
        postResponse.posts.map((post: z.infer<typeof PostSchema>) => (
          <div key={post.id} className="w-full mb-4">
            <PostCard
              post={post}
              userId={loggedInUserResponse.user.id}
              isSaved={savedPostSet.has(post.id)}
            />
          </div>
        ))}
    </div>
  );
};

export default PersonaPostList;
