import PostCreationCard from "@/components/common/PostCreationCard";
import StreamPostList from "@/components/stream/StreamPostList";

const StreamPage = async () => {
  return (
    <div className="flex flex-col px-44 h-screen overflow-y-auto no-scrollbar">
      <PostCreationCard />
      <StreamPostList />
    </div>
  );
};

export default StreamPage;
