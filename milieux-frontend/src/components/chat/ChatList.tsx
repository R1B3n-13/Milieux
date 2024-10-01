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
  const { selectedChat, setSelectedChat, setTempMessage } = useChatContext();

  return (
    <div className="flex-grow overflow-y-auto p-2">
      {chatList &&
        chatList.map((chat) => (
          <div key={chat.id}>
            {(chat.lastText || chat.id === selectedChat?.id) && (
              <div
                onClick={() => {
                  setSelectedChat(chat);
                  setTempMessage([]);
                }}
                className={`flex items-center gap-3 p-3 mb-3 mx-5 ${
                  chat.id === selectedChat?.id
                    ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400"
                    : "bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-100 hover:bg-gradient-to-r hover:from-indigo-200 hover:via-violet-200 hover:to-indigo-300"
                } rounded-lg shadow  cursor-pointer`}
              >
                <Avatar className="rounded-full p-1 items-center justify-center cursor-pointer">
                  <AvatarImage
                    src={
                      chat.users?.some((user) => user.id === -1)
                        ? "/sentia.png"
                        : (chat?.users?.find(
                            (user) => user.id !== loggedInUser.id
                          )?.dp as string)
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
