import { getSavedPosts } from "@/services/postService";
import PostCard from "../common/PostCard";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";
import { getUserFromAuthToken } from "@/services/userService";

const BookmarkedPostList = async () => {
  const savedPostResponsePromise = getSavedPosts();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [savedPostResponse, loggedInUserResponse] = await Promise.all([
    savedPostResponsePromise,
    loggedInUserResponsePromise,
  ]);

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <>
      {savedPostResponse.success &&
        savedPostResponse.posts.map((post: z.infer<typeof PostSchema>) => (
          <div key={post.id} className="min-w-full">
            <PostCard
              post={post}
              userId={loggedInUserResponse.user.id}
              isSaved={true}
            />
          </div>
        ))}
    </>
  );
};

export default BookmarkedPostList;
