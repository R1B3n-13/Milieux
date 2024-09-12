"use client";

import { useEffect, useRef, useState } from "react";
import AvatarIcon from "../icons/AvatarIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { useChatContext } from "./ChatContextProvider";
import { getChatMessages } from "@/services/chatService";
import { z } from "zod";
import MessageSchema from "@/schemas/messageSchema";
import UserSchema from "@/schemas/userSchema";
import { ScrollArea } from "../ui/ScrollArea";
import Image from "next/image";
import { getBackendUrl } from "@/actions/getEnvVarActions";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";
import { revalidateMessage } from "@/actions/revalidationActions";
import MarkdownRenderer from "../common/MarkdownRenderer";
import VideoCallingFilledIcon from "../icons/VideoCallingFilledIcon";
import AudioCallingFilledIcon from "../icons/AudioCallingFilledIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { chatbotPersonalityItems } from "./items/chatbotPersonalityItems";

export const MessageBox = ({
  loggedInUser,
}: {
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const [messages, setMessages] = useState<z.infer<typeof MessageSchema>[]>([]);
  const {
    selectedChat,
    triggerRefresh,
    setTriggerRefresh,
    setStompClient,
    aiStreamingText,
    tempMessage,
    chatPersonality,
    setChatPersonality,
  } = useChatContext();
  const stompClientRef = useRef<Client | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const subscribeToChat = (client: Client) => {
    if (selectedChat?.id) {
      client.subscribe(`/topic/chat/${selectedChat.id}`, (message) => {
        if (message.body === selectedChat.id?.toString()) {
          setTriggerRefresh(!triggerRefresh);
          revalidateMessage();
        }
      });
    }
  };

  useEffect(() => {
    const initConnection = async () => {
      try {
        const backendUrl = await getBackendUrl();
        const socket = new SockJS(`${backendUrl}/ws`);
        const client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,

          onConnect: () => {
            console.log("STOMP client connected...");
            subscribeToChat(client);
          },

          onStompError: (error) => {
            console.error("STOMP error:", error);
            toast.error(
              "Lost connection to the chat server. Please refresh the page."
            );
          },
        });

        client.activate();
        stompClientRef.current = client;
        setStompClient(client);
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        toast.error("Something went wrong. Please refresh the page.");
      }
    };

    initConnection();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      subscribeToChat(stompClientRef.current);
    }
  }, [selectedChat]);

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
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="flex items-center justify-start min-h-[4.3rem] gap-2 p-4 border-b border-indigo-200 bg-indigo-100">
        {selectedChat && (
          <>
            <Avatar className="rounded-full bg-gray-200 p-1 items-center justify-center cursor-pointer">
              <AvatarImage
                src={
                  selectedChat.users?.some((user) => user.id === -1)
                    ? "/sentia.png"
                    : (selectedChat?.users?.find(
                        (user) => user.id !== loggedInUser.id
                      )?.dp as string)
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

            {selectedChat.users?.some((user) => user.id === -1) && (
              <div className="flex ml-auto items-center justify-center">
                <Select
                  onValueChange={(str) => setChatPersonality(str)}
                  value={chatPersonality}
                >
                  <SelectTrigger className="w-64 rounded-full bg-amber-50">
                    <SelectValue placeholder="Select a personality" />
                  </SelectTrigger>
                  <SelectContent>
                    {chatbotPersonalityItems.map((model) => (
                      <SelectItem
                        className="text-lg"
                        key={model.value}
                        value={model.value}
                      >
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="ml-auto mr-3 text-slate-700 text-3xl rounded-full cursor-pointer p-1 hover:bg-purple-300">
              <AudioCallingFilledIcon />
            </div>

            <div className="text-slate-700 text-3xl rounded-full cursor-pointer p-1 hover:bg-purple-300">
              <VideoCallingFilledIcon />
            </div>
          </>
        )}
      </div>

      <ScrollArea className="h-screen bg-indigo-50" ref={scrollAreaRef}>
        <div className="p-4 flex-grow bg-indigo-50 overflow-y-auto">
          {messages.map((message) => (
            <div className="flex items-center gap-3" key={message.id}>
              {message.user?.id !== loggedInUser.id && (
                <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                  <AvatarImage
                    src={
                      message.user?.id === -1
                        ? "/sentia.png"
                        : (message.user?.dp as string)
                    }
                  />
                  <AvatarFallback className="text-4xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`mb-2 p-2 max-w-[25rem] min-w-14 min-h-10 flex flex-col ${
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
                <div></div>
                <MarkdownRenderer text={message.text || ""} />
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

          {tempMessage[0] && (
            <div className="flex items-center gap-3">
              <div className="mb-2 p-2 max-w-[25rem] min-w-14 min-h-10 flex flex-col bg-indigo-500 text-white ml-auto rounded-br-none rounded-lg">
                {tempMessage[1] && (
                  <Image
                    src={tempMessage[1] as string}
                    alt=""
                    width={350}
                    height={350}
                    className="rounded-lg mb-2"
                  />
                )}
                <MarkdownRenderer text={tempMessage[0]} />
              </div>

              <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                <AvatarImage src={loggedInUser.dp as string} />
                <AvatarFallback className="text-4xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {aiStreamingText && (
            <div className="flex items-center gap-3">
              <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                <AvatarImage src="/sentia.png" />
                <AvatarFallback className="text-4xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>

              <div className="mb-2 p-2 max-w-[25rem] min-w-14 min-h-10 flex flex-col bg-gray-300 text-black rounded-bl-none rounded-lg">
                <MarkdownRenderer text={aiStreamingText} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
};
