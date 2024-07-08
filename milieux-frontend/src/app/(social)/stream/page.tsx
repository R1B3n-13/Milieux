import PostCreationCard from "@/components/common/PostCreationCard";
import StreamPostList from "@/components/stream/StreamPostList";

const StreamPage = () => {
  return (
    <div className="flex flex-col px-40 h-screen overflow-y-auto no-scrollbar">
      <PostCreationCard />
      <StreamPostList />
    </div>
  );
};

export default StreamPage;
