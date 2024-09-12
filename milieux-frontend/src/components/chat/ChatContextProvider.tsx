"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { z } from "zod";
import ChatSchema from "@/schemas/chatSchema";
import { Client } from "@stomp/stompjs";

const ChatContext = createContext<{
  selectedChat: z.infer<typeof ChatSchema> | null;
  setSelectedChat: React.Dispatch<
    React.SetStateAction<z.infer<typeof ChatSchema> | null>
  >;
  triggerRefresh: boolean;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  stompClient: Client | undefined;
  setStompClient: React.Dispatch<React.SetStateAction<Client | undefined>>;
  aiStreamingText: string;
  setAiStreamingText: React.Dispatch<React.SetStateAction<string>>;
  tempMessage: string[];
  setTempMessage: React.Dispatch<React.SetStateAction<string[]>>;
  chatPersonality: string | undefined;
  setChatPersonality: React.Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<z.infer<
    typeof ChatSchema
  > | null>(null);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
  const [aiStreamingText, setAiStreamingText] = useState("");
  const [tempMessage, setTempMessage] = useState<string[]>([]);
  const [chatPersonality, setChatPersonality] = useState<string | undefined>(
    undefined
  );

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        triggerRefresh,
        setTriggerRefresh,
        stompClient,
        setStompClient,
        aiStreamingText,
        setAiStreamingText,
        tempMessage,
        setTempMessage,
        chatPersonality,
        setChatPersonality,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}
