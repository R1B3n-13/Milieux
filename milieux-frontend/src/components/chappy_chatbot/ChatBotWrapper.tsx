import ChatBot from "./ChatBot";
import { ChatBotContextProvider } from "./ChatBotContextProvider";

const ChatBotWrapper = ({ userId }: { userId: number | null | undefined }) => {
  return (
    <ChatBotContextProvider>
      <ChatBot userId={userId} />
    </ChatBotContextProvider>
  );
};

export default ChatBotWrapper;
