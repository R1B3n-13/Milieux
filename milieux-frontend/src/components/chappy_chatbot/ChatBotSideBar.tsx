import ChappyIcon from "@/components/icons/ChappyIcon";

const ChatBotSideBar = () => {
  return (
    <div className="w-1/5 p-4 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-100 h-full flex flex-col rounded-s-lg border border-violet-300">
      <div className="flex items-center text-3xl absolute rounded-lg bg-white p-1">
        <ChappyIcon />
      </div>
    </div>
  );
};

export default ChatBotSideBar;
