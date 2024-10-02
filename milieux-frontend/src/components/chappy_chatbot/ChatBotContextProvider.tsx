"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { z } from "zod";
import AiChatSessionSchema from "@/schemas/aiChatSessionSchema";

const ChatBotContext = createContext<{
  selectedChatSession: z.infer<typeof AiChatSessionSchema> | null;
  setSelectedChatSession: React.Dispatch<
    React.SetStateAction<z.infer<typeof AiChatSessionSchema> | null>
  >;
  triggerRefresh: boolean;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function ChatBotContextProvider({ children }: { children: ReactNode }) {
  const [selectedChatSession, setSelectedChatSession] = useState<z.infer<
    typeof AiChatSessionSchema
  > | null>(null);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  return (
    <ChatBotContext.Provider
      value={{
        selectedChatSession,
        setSelectedChatSession,
        triggerRefresh,
        setTriggerRefresh,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
}

export function useChatBotContext() {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error(
      "useChatBotContext must be used within a ChatBotContextProvider"
    );
  }
  return context;
}
