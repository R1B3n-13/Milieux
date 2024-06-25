import { FeedTabs } from "./FeedTabs";

const RightSideBar = () => {
  return (
    <div className="flex ml-auto flex-col gap-3 w-3/5 h-screen font-medium text-slate-700 transition-all">
      <div className="flex items-center justify-center mt-1">
        <h1>Your RSS Feeds</h1>
      </div>
      <FeedTabs />
    </div>
  );
};

export default RightSideBar;
