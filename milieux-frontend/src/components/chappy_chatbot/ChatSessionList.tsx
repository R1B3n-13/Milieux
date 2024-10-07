"use client";

import { useEffect, useState } from "react";
import { getAiChatSessions } from "@/services/aiChatSessionService";
import AiChatSessionSchema from "@/schemas/aiChatSessionSchema";
import { z } from "zod";
import Loading from "../common/Loading";
import { useChatBotContext } from "./ChatBotContextProvider";
import FolderLineIcon from "../icons/FolderLineIcon";
import DeleteFilledIcon from "../icons/DeleteFilledIcon";
import { deleteAiChatSession } from "@/actions/aiChatSessionsAction";
import { toast } from "sonner";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { revalidateAiChatSessionDelete } from "@/actions/revalidationActions";

const ChatSessionList = ({ userId }: { userId: number | null | undefined }) => {
  const [aiChatSessions, setAiChatSessions] = useState<
    z.infer<typeof AiChatSessionSchema>[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    selectedChatSession,
    setSelectedChatSession,
    triggerRefresh,
    setTriggerRefresh,
  } = useChatBotContext();

  useEffect(() => {
    const fetchAiChatSessions = async () => {
      const aiChatSessionsResponse = await getAiChatSessions(userId);

      if (aiChatSessionsResponse.success) {
        setAiChatSessions(aiChatSessionsResponse.aiChatSessions);
      }

      setLoading(false);
    };

    fetchAiChatSessions();
  }, [triggerRefresh]);

  const handleSessionDeletion = async () => {
    const response = await deleteAiChatSession(selectedChatSession?.id);

    if (response.success) {
      toast.success("Chat session deleted successfully!");
      revalidateAiChatSessionDelete();
      setTriggerRefresh(!triggerRefresh);
    } else {
      toast.error("Session deletion failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="mt-4 p-2 text-violet-600">
        <Loading text="Loading..." />
      </div>
    );
  }

  return (
    <>
      {aiChatSessions.length > 0 && (
        <div
          className={`flex flex-col items-center justify-center gap-3 mt-2 p-2`}
        >
          {aiChatSessions.map((session, index) => (
            <div
              key={index}
              className={`px-5 py-3 w-full flex items-center justify-start ${
                session.id === selectedChatSession?.id
                  ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400"
                  : "bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-100 hover:bg-gradient-to-r hover:from-indigo-200 hover:via-violet-200 hover:to-indigo-300"
              } rounded-lg shadow  cursor-pointer font-medium text-slate-800`}
              onClick={() => setSelectedChatSession(session)}
            >
              <div className="text-xl text-violet-600">
                <FolderLineIcon />
              </div>
              <p className="w-full flex justify-center">{session.name}</p>

              <ConfirmationDialog
                onConfirm={handleSessionDeletion}
                confirmationText={
                  "This action cannot be undone. This will permanently delete the session."
                }
                dialogButton={
                  <div className="text-xl text-red-600">
                    <DeleteFilledIcon />
                  </div>
                }
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChatSessionList;
