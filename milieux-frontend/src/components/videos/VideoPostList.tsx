import { getAllPosts, getSavedPosts } from "@/services/postService";
import PostCard from "../common/PostCard";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";
import { getUserFromAuthToken } from "@/services/userService";

const VideoPostList = async () => {
  const postResponsePromise = getAllPosts();
  const savedPostResponsePromise = getSavedPosts();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [postResponse, savedPostResponse, loggedInUserResponse] =
    await Promise.all([
      postResponsePromise,
      savedPostResponsePromise,
      loggedInUserResponsePromise,
    ]);

  let videoPostList: z.infer<typeof PostSchema>[] = [];

  if (postResponse.success) {
    videoPostList = postResponse.posts.filter(
      (post: z.infer<typeof PostSchema>) => post.videoPath
    );
  }

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <>
      {postResponse.success &&
        videoPostList.map((post: z.infer<typeof PostSchema>) => (
          <div key={post.id}>
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

export default VideoPostList;
