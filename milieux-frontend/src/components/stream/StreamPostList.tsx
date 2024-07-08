import { getAllPosts } from "@/services/postService";
import PostCard from "../common/PostCard";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";
import { getUserFromAuthToken } from "@/services/userService";

const StreamPostList = async () => {
  const postResponsePromise = getAllPosts();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [postResponse, loggedInUserResponse] = await Promise.all([
    postResponsePromise,
    loggedInUserResponsePromise,
  ]);

  return (
    <div>
      {postResponse.success &&
        postResponse.posts.map((post: z.infer<typeof PostSchema>) => (
          <PostCard
            key={post.id}
            post={post}
            userId={loggedInUserResponse.user.id}
          />
        ))}
    </div>
  );
};

export default StreamPostList;
