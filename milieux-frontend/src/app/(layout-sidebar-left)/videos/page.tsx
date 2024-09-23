import VideoPostList from "@/components/videos/VideoPostList";

const VideosPage = () => {
  return (
    <div className="flex flex-col px-40 h-screen overflow-y-auto no-scrollbar mt-4 gap-4">
      <VideoPostList />
    </div>
  );
};

export default VideosPage;
