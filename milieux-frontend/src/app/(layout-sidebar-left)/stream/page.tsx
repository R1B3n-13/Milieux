import PostCreationCard from "@/components/common/PostCreationCard";
import FlashCarouselCaller from "@/components/stream/FlashCarouselCaller";
import StreamPostList from "@/components/stream/StreamPostList";

const StreamPage = async () => {
  return (
    <div className="flex flex-col px-40 h-screen overflow-y-auto gap-4 no-scrollbar">
      <FlashCarouselCaller />
      <PostCreationCard />
      <StreamPostList />
    </div>
  );
};

export default StreamPage;
