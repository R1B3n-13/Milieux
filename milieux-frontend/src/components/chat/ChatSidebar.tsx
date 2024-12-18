import { ChatSearchBar } from "./ChatSearchBar";
import { ChatList } from "./ChatList";
import UserSchema from "@/schemas/userSchema";
import { z } from "zod";
import ChatSchema from "@/schemas/chatSchema";

export const ChatSidebar = ({
  chatList,
  loggedInUser,
}: {
  chatList: z.infer<typeof ChatSchema>[];
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  return (
    <div className="w-1/4 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200 h-screen flex flex-col border-r border-violet-400">
      <ChatSearchBar />
      <ChatList chatList={chatList} loggedInUser={loggedInUser} />
    </div>
  );
};
