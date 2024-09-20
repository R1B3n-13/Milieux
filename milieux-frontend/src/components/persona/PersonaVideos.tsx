import PostSchema from "@/schemas/postSchema";
import { getPostsByUserId, getSavedPosts } from "@/services/postService";
import { getUserFromAuthToken } from "@/services/userService";
import { z } from "zod";
import PostCard from "../common/PostCard";
import VideoPlayer from "../common/VideoPlayer";

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

  const videos = posts
    .filter((post) => post.videoPath)
    .map((post) => post.videoPath);

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="w-full h-48 rounded-lg overflow-hidden">
            <VideoPlayer
              src={video || ""}
              width={500}
              className="w-full h-full object-cover rounded-lg"
              controls
              autoPlay={false}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PersonaPostList;
