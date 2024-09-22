import { getQueryResponse } from "@/actions/aiActions";
import PostSchema from "@/schemas/postSchema";
import { getPostsByIds } from "@/services/searchService";
import { z } from "zod";
import PostCard from "../common/PostCard";
import { getSavedPosts } from "@/services/postService";
import { getUserFromAuthToken } from "@/services/userService";

const AiSearchResult = async ({ query }: { query: string }) => {
  const searchResponsePromise = getQueryResponse({ query });
  const savedPostResponsePromise = getSavedPosts();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [searchResponse, savedPostResponse, loggedInUserResponse] =
    await Promise.all([
      searchResponsePromise,
      savedPostResponsePromise,
      loggedInUserResponsePromise,
    ]);

  const savedPostSet = new Set();

  savedPostResponse.posts?.forEach((post: z.infer<typeof PostSchema>) => {
    savedPostSet.add(post.id);
  });

  let postIds: number[] = [];
  let posts: z.infer<typeof PostSchema>[] = [];

  if (searchResponse.success) {
    const parsedResponse = JSON.parse(searchResponse.result);
    parsedResponse.postIds.map((postId: number) => postIds.push(postId));

    const postResponse = await getPostsByIds(postIds);

    if (postResponse.success) {
      posts = postResponse.posts;
    }
  }

  return (
    <>
      <div className="mt-5 ml-7 flex items-center gap-1 text-lg text-slate-800">
        Showing results for : <p className="font-semibold">{query}</p>{" "}
      </div>
      {posts.map((post: z.infer<typeof PostSchema>) => (
        <div key={post.id} className="px-40 w-full pt-4">
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

export default AiSearchResult;
