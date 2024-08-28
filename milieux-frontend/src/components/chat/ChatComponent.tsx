import { getUserFromAuthToken } from "@/services/userService";
import { ChatSidebar } from "./ChatSidebar";
import { MessageBox } from "./MessageBox";
import { MessageInput } from "./MessageInput";
import { getChats } from "@/services/chatService";
import ChatSchema from "@/schemas/chatSchema";
import { z } from "zod";
import { ChatContextProvider } from "./ChatContextProvider";

const ChatComponent = async () => {
  let chatList: z.infer<typeof ChatSchema>[] = [];

  const loggedInUserPromise = getUserFromAuthToken();
  const chatListPromise = getChats();

  const [loggedInUserResponse, chatListResponse] = await Promise.all([
    loggedInUserPromise,
    chatListPromise,
  ]);

  if (chatListResponse.success) {
    chatList = chatListResponse.chats;
  }

  return (
    <div className="flex h-screen">
      <ChatContextProvider>
        <ChatSidebar
          chatList={chatList}
          loggedInUser={loggedInUserResponse.user}
        />
        <div className="flex flex-col flex-grow">
          <MessageBox loggedInUser={loggedInUserResponse.user} />
          <MessageInput />
        </div>
      </ChatContextProvider>
    </div>
  );
};

export default ChatComponent;
