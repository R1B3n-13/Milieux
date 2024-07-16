import { getQueryResponse } from "@/actions/aiActions";
import PostSchema from "@/schemas/postSchema";
import { getPostsByIds } from "@/services/searchService";
import { z } from "zod";

const AiSearchResult = async ({ query }: { query: string }) => {
  const searchResponse = await getQueryResponse({ query });

  let postIds: number[] = [];
  let posts: z.infer<typeof PostSchema>[] = [];

  if (searchResponse.success) {
    const parsedResponse = JSON.parse(searchResponse.result);
    parsedResponse.postIds.map((postId: number) => postIds.push(postId));

    const postResponse = await getPostsByIds(postIds);

    if (postResponse.success) {
      posts = postResponse.posts;

      console.log(posts);
    }
  }

  return <div>AiSearchResult</div>;
};

export default AiSearchResult;
