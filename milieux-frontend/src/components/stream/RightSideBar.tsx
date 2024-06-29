import FeedTabs from "./FeedTabs";

const RightSideBar = () => {
  return (
    <div className="flex ml-auto px-8 flex-col gap-3 w-9/12 h-screen font-medium text-slate-700 transition-all">
      <div className="flex items-center justify-center mt-3">
        <h1>What's trending?</h1>
      </div>
      <FeedTabs />
    </div>
  );
};

export default RightSideBar;
