"use client";

import ChappyIcon from "@/components/icons/ChappyIcon";
import { Input } from "../ui/Input";
import { useState } from "react";
import AddFolderLineIcon from "../icons/AddFolderLineIcon";
import { createAiChatSession } from "@/actions/aiChatSessionsAction";
import { toast } from "sonner";
import { revalidateAiChatSessions } from "@/actions/revalidationActions";
import Loading from "../common/Loading";
import ChatSessionList from "./ChatSessionList";
import { useChatBotContext } from "./ChatBotContextProvider";

const ChatBotSideBar = () => {
  const [newSessionName, setNewSessionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { triggerRefresh, setTriggerRefresh } = useChatBotContext();

  const handleSessionCreation = async () => {
    if (!newSessionName || newSessionName.trim() === "") return;

    setIsLoading(true);

    const response = await createAiChatSession({
      name: newSessionName,
      chatHistory: [],
    });

    if (response.success) {
      toast.success("Session created successfully!");
      setTriggerRefresh(!triggerRefresh);
      revalidateAiChatSessions();
      setNewSessionName("");
    } else {
      toast.error("Session creation failed. Try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-1/5 p-3 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200 h-full flex flex-col rounded-s-lg border border-violet-300 overflow-y-auto">
      <div className="relative w-full h-11 bg-violet-200 rounded-full p-1 mt-1">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
          <ChappyIcon />
        </div>
        <Input
          value={newSessionName}
          onChange={(e) => setNewSessionName(e.target.value)}
          className="px-11 w-full h-full rounded-full bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-100 focus-visible:ring-0 border-none shadow-lg"
          placeholder="Enter a session name..."
        />
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-violet-600 cursor-pointer"
          onClick={handleSessionCreation}
        >
          {isLoading ? <Loading text={""} /> : <AddFolderLineIcon />}
        </div>
      </div>
      <ChatSessionList />
    </div>
  );
};

export default ChatBotSideBar;
