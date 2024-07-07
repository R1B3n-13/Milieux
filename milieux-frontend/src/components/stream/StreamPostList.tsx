import { getAllPosts } from "@/actions/postActions";
import PostCard from "../common/PostCard";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";
import { getUserFromAuthToken } from "@/actions/userActions";

const StreamPostList = async () => {
  const postResponse = await getAllPosts();

  const loggedInUserResponse = await getUserFromAuthToken();

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
