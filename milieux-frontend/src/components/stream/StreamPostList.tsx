import { getAllPosts, getSavedPosts } from "@/services/postService";
import PostCard from "../common/PostCard";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";
import { getUserFromAuthToken } from "@/services/userService";

const StreamPostList = async () => {
  const postResponsePromise = getAllPosts();
  const savedPostResponsePromise = getSavedPosts();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [postResponse, savedPostResponse, loggedInUserResponse] =
    await Promise.all([
      postResponsePromise,
      savedPostResponsePromise,
      loggedInUserResponsePromise,
    ]);

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <div>
      {postResponse.success &&
        postResponse.posts.map((post: z.infer<typeof PostSchema>) => (
          <PostCard
            key={post.id}
            post={post}
            userId={loggedInUserResponse.user.id}
            isSaved={savedPostSet.has(post.id)}
          />
        ))}
    </div>
  );
};

export default StreamPostList;
