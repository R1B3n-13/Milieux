import FeedTabs from "./FeedTabs";

const RightSideBar = () => {
  return (
    <div className="flex ml-auto px-3 flex-col gap-3 w-2/3 h-screen font-medium text-slate-700 transition-all">
      <div className="flex items-center justify-center mt-4">
        <h1>What's trending?</h1>
      </div>
      <FeedTabs />
    </div>
  );
};

export default RightSideBar;
