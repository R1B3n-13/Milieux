import PostCreationCard from "@/components/common/PostCreationCard";
import FlashCarousel from "@/components/stream/FlashCarousel";
import StreamPostList from "@/components/stream/StreamPostList";

const StreamPage = () => {
  return (
    <div className="flex flex-col px-40 h-screen overflow-y-auto no-scrollbar">
      <FlashCarousel />
      <PostCreationCard />
      <StreamPostList />
    </div>
  );
};

export default StreamPage;
