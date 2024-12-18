import TrendFilledIcon from "../icons/TrendFilledIcon";
import FeedSelector from "./FeedSelector";

const RightSideBar = () => {
  return (
    <div className="flex ml-auto pr-8 flex-col gap-3 w-full h-screen font-medium text-slate-700 transition-all">
      <div className="flex font-semibold items-center mt-6 mb-1">
        <div className="text-amber-600">
          <TrendFilledIcon />
        </div>
        <h1 className="ml-2">What&apos;s Trending?</h1>
      </div>

      <FeedSelector />
    </div>
  );
};

export default RightSideBar;
