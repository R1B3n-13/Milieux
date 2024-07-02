import PostCreationCard from "@/components/common/PostCreationCard";
import PostCard from "@/components/stream/PostCard";

const StreamPage = async () => {
  return (
    <div>
      <PostCreationCard />
      <PostCard />
    </div>
  );
};

export default StreamPage;
