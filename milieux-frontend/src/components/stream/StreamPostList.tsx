import { getAllPosts } from "@/actions/postActions";
import PostCard from "../common/PostCard";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";

const StreamPostList = async () => {
  const response = await getAllPosts();

  return (
    <div>
      {response.success &&
        response.posts.map((post: z.infer<typeof PostSchema>) => (
          <PostCard key={post.id} post={post} />
        ))}
    </div>
  );
};

export default StreamPostList;
