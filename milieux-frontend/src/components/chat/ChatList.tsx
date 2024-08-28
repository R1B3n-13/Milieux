"use client";

import { z } from "zod";
import AvatarIcon from "../icons/AvatarIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import UserSchema from "@/schemas/userSchema";
import ChatSchema from "@/schemas/chatSchema";
import { useChatContext } from "./ChatContextProvider";

export const ChatList = ({
  chatList,
  loggedInUser,
}: {
  chatList: z.infer<typeof ChatSchema>[];
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const { selectedChat, setSelectedChat } = useChatContext();

  return (
    <div className="flex-grow overflow-y-auto p-2">
      {chatList &&
        chatList.map((chat) => (
          <div key={chat.id}>
            {(chat.lastText || chat.id === selectedChat?.id) && (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-3 mb-3 mx-5 ${
                  chat.id === selectedChat?.id
                    ? "bg-indigo-300"
                    : "bg-slate-100 hover:bg-indigo-200"
                } rounded-lg shadow  cursor-pointer`}
              >
                <Avatar className="rounded-full p-1 items-center justify-center cursor-pointer">
                  <AvatarImage
                    src={
                      chat.users?.find((user) => user.id !== loggedInUser.id)
                        ?.dp as string
                    }
                    className="rounded-full"
                  />
                  <AvatarFallback className="text-4xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {
                      chat.users?.find((user) => user.id !== loggedInUser.id)
                        ?.name
                    }
                  </h4>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {chat.lastText}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
