"use client";

import { useEffect, useRef, useState } from "react";
import AvatarIcon from "../icons/AvatarIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { useChatContext } from "./ChatContextProvider";
import { getChatMessages } from "@/actions/chatActions";
import { z } from "zod";
import MessageSchema from "@/schemas/messageSchema";
import UserSchema from "@/schemas/userSchema";
import { ScrollArea } from "../ui/ScrollArea";
import Image from "next/image";
import { disconnectWebSocket, listenOnSocket } from "@/actions/wsActions";

export const MessageBox = ({
  loggedInUser,
}: {
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const [messages, setMessages] = useState<z.infer<typeof MessageSchema>[]>([]);
  const { selectedChat, triggerRefresh, setTriggerRefresh } = useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (selectedChat?.id) {
        const response = await getChatMessages(selectedChat.id);
        if (response.success) {
          setMessages(response.chatMessages.reverse());
        }
      }
    };
    fetchChatMessages();
  }, [selectedChat, triggerRefresh]);

  useEffect(() => {
    if (selectedChat?.id) {
      listenOnSocket(selectedChat.id, () => {
        setTriggerRefresh(!triggerRefresh);
      });
    }

    return () => {
      disconnectWebSocket();
    };
  }, [selectedChat]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="flex items-center justify-start gap-3 p-4 border-b border-indigo-200 bg-indigo-100">
        <Avatar className="rounded-full bg-gray-200 p-1 items-center justify-center cursor-pointer">
          <AvatarImage
            src={
              selectedChat?.users?.find((user) => user.id !== loggedInUser.id)
                ?.dp as string
            }
          />
          <AvatarFallback className="text-5xl text-gray-500">
            <AvatarIcon />
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-slate-800 cursor-pointer">
          {
            selectedChat?.users?.find((user) => user.id !== loggedInUser.id)
              ?.name
          }
        </p>
      </div>

      <ScrollArea className="h-screen bg-indigo-50" ref={scrollAreaRef}>
        <div className="p-4 flex-grow bg-indigo-50 overflow-y-auto">
          {messages.map((message) => (
            <div className="flex items-center gap-3" key={message.id}>
              {message.user?.id !== loggedInUser.id && (
                <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                  <AvatarImage src={message.user?.dp as string} />
                  <AvatarFallback className="text-4xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`mb-2 p-2 max-w-xs min-w-14 min-h-10 flex flex-col ${
                  message.user?.id === loggedInUser.id
                    ? "bg-indigo-500 text-white ml-auto rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                } rounded-lg`}
              >
                {message.imagePath && (
                  <Image
                    src={message.imagePath as string}
                    alt=""
                    width={350}
                    height={350}
                    className="rounded-lg mb-2"
                  />
                )}
                <p>{message.text}</p>
              </div>

              {message.user?.id === loggedInUser.id && (
                <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                  <AvatarImage src={message.user?.dp as string} />
                  <AvatarFallback className="text-4xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
