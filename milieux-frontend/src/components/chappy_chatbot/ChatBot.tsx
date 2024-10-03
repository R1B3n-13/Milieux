"use client";

import { ScrollArea } from "@/components/ui/ScrollArea";
import { TextArea } from "../ui/TextArea";
import { useState, useRef, useEffect } from "react";
import { askCustomChatbot } from "@/actions/aiActions";
import { Button } from "../ui/Button";
import SendFilledIcon from "../icons/SendFilledIcon";
import Loading from "../common/Loading";
import BotLineIcon from "../icons/BotLineIcon";
import PersonLineIcon from "../icons/PersonLineIcon";
import { readStreamableValue } from "ai/rsc";
import MarkdownRenderer from "../common/MarkdownRenderer";
import { z } from "zod";
import AiChatParamsSchema from "@/schemas/aiChatParamsSchema";
import { getAiChatParams, getAiTool } from "@/services/aiService";
import { defaultSystemInstruction } from "./items/defaultSystemInstruction";
import { defaultSystemInstructionForTool } from "./items/defaultSystemInstructionForTool";
import AiToolSchema from "@/schemas/aiToolSchema";
import ChatBotSideBar from "./ChatBotSideBar";
import {
  ChatBotContextProvider,
  useChatBotContext,
} from "./ChatBotContextProvider";
import ChatSlashedFilledIcon from "../icons/ChatSlashedFilledIcon";
import { getAiChatSessionHistory } from "@/services/aiChatSessionService";
import { updateAiChatSessionHistory } from "@/actions/aiChatSessionsAction";
import { toast } from "sonner";
import { revalidateAiChatSessionUpdate } from "@/actions/revalidationActions";

const ChatBot = ({ userId }: { userId: number | null | undefined }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "model"; parts: string }[]
  >([]);
  const [temperature, setTemperature] = useState(0.8);
  const [topP, setTopP] = useState(0.8);
  const [topK, setTopK] = useState(60);
  const [currentPdfName, setCurrentPdfName] = useState<
    string | null | undefined
  >(undefined);
  const [systemInstruction, setSystemInstruction] = useState(
    defaultSystemInstruction
  );

  const [toolFile, setToolFile] = useState<Blob | null>(null);
  const [toolTemperature, setToolTemperature] = useState(1);
  const [toolTopP, setToolTopP] = useState(0.95);
  const [toolTopK, setToolTopK] = useState(64);
  const [toolSystemInstruction, setToolSystemInstruction] = useState(
    defaultSystemInstructionForTool
  );

  const { selectedChatSession, triggerRefresh } = useChatBotContext();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  let aiChatParams: z.infer<typeof AiChatParamsSchema> = {
    temperature: 0.8,
    topP: 0.8,
    topK: 60,
    systemInstruction: defaultSystemInstruction,
  };

  useEffect(() => {
    const getChatSessionHistory = async () => {
      const response = await getAiChatSessionHistory(selectedChatSession?.id);

      if (response.success) {
        setChatHistory(response.chatHistory);
      }
    };

    getChatSessionHistory();
  }, [selectedChatSession]);

  useEffect(() => {
    const initAiChatParams = async () => {
      const response = await getAiChatParams(userId);

      if (response.success) {
        aiChatParams = response.aiChatParams;
        setTemperature(aiChatParams.temperature || 0.8);
        setTopP(aiChatParams.topP || 0.8);
        setTopK(aiChatParams.topK || 60);
        setCurrentPdfName(aiChatParams.currentPdfName);
        setSystemInstruction(
          aiChatParams.systemInstruction || defaultSystemInstruction
        );
      } else {
        setCurrentPdfName(null);
      }
    };

    initAiChatParams();
  }, [triggerRefresh]);

  let aiToolParams: z.infer<typeof AiToolSchema> = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    systemInstruction: defaultSystemInstructionForTool,
  };

  useEffect(() => {
    const initAiTool = async () => {
      const response = await getAiTool(userId);

      if (response.success) {
        aiToolParams = response.aiTool;
        setToolTemperature(aiToolParams.temperature || 1);
        setToolTopP(aiToolParams.topP || 0.95);
        setToolTopK(aiToolParams.topK || 64);
        if (aiToolParams.fileData) {
          setToolFile(aiToolParams.fileData);
        }
        setToolSystemInstruction(
          aiToolParams.systemInstruction || defaultSystemInstructionForTool
        );
      }
    };

    initAiTool();
  }, [triggerRefresh]);

  const handleSubmit = async () => {
    if (query.trim() === "" || !userId) return;

    setIsLoading(true);

    const data = {
      query,
      userId,
      history: chatHistory,
      temperature: temperature,
      top_p: topP,
      top_k: topK,
      system_instruction: systemInstruction,
      temperature_tool: toolTemperature,
      top_p_tool: toolTopP,
      top_k_tool: toolTopK,
      system_instruction_tool: toolSystemInstruction,
    };

    setChatHistory([
      ...chatHistory,
      { role: "user", parts: query },
      { role: "model", parts: "" },
    ]);

    const formData = new FormData();
    formData.append("request", JSON.stringify(data));

    if (toolFile) {
      formData.append("tool_file", new File([toolFile], "functions_n_schemas"));
    }

    const { result, success } = await askCustomChatbot(formData);

    let textStream = "";

    for await (const delta of readStreamableValue(result)) {
      textStream += delta;

      setChatHistory((prevChatHistory) => {
        const newChatHistory = [...prevChatHistory];
        newChatHistory[newChatHistory.length - 1].parts = textStream;
        return newChatHistory;
      });
    }

    if (success) {
      const historyData: { role: "user" | "model"; parts: string }[] = [
        { role: "user", parts: query },
        { role: "model", parts: textStream },
      ];

      const response = await updateAiChatSessionHistory(
        { chatHistory: historyData },
        selectedChatSession?.id
      );

      if (!response.success) {
        toast.error("Couldn't persist chat session history.");
      } else {
        revalidateAiChatSessionUpdate();
      }
    }

    setQuery("");
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div
      className={`${
        currentPdfName &&
        "bg-white h-full p-3 w-full flex flex-col rounded-lg shadow-md"
      }`}
    >
      {currentPdfName ? (
        <div className="flex h-full w-full">
          <ChatBotSideBar />
          <div className="w-full h-full">
            <ScrollArea
              ref={scrollAreaRef}
              className="border border-violet-300 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200 rounded-e-lg py-7 px-20 w-full h-full overflow-y-auto z-10 relative"
            >
              {!selectedChatSession && (
                <div className="flex items-center justify-center text-violet-900 h-[70vh]">
                  <div className="text-[15rem] flex flex-col items-center justify-center h-full">
                    <ChatSlashedFilledIcon />
                    <p className="text-3xl font-semibold">
                      No session selected
                    </p>
                  </div>
                </div>
              )}

              {selectedChatSession &&
                chatHistory.map((chat, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-end">
                      {chat.role === "user" && (
                        <div className="flex items-start gap-3 text-sm text-black bg-white py-2 px-4 rounded-lg w-fit max-w-[40rem] break-words">
                          <div className="text-2xl mt-[0.1rem] text-slate-800 bg-violet-100 p-1 rounded-full">
                            <PersonLineIcon />
                          </div>
                          <MarkdownRenderer text={chat.parts} />
                        </div>
                      )}
                    </div>
                    {chat.role === "model" && (
                      <div className="flex items-start gap-3 text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 max-w-[40rem] text-sm py-2 px-4 rounded-lg w-fit mt-1 break-words">
                        <div className="text-2xl mt-[0.1rem] text-black bg-gray-50 p-1 rounded-full">
                          <BotLineIcon />
                        </div>
                        {chat.parts ? (
                          <MarkdownRenderer text={chat.parts} />
                        ) : (
                          <MarkdownRenderer text={"Thinking..."} />
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </ScrollArea>

            {selectedChatSession && (
              <div className="relative flex items-center justify-center p-4">
                <TextArea
                  className="-translate-y-20 z-20 flex items-center justify-center pl-5 pr-11 py-[0.9rem] resize-none rounded-full min-h-0 h-12 bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-100 focus-visible:ring-violet-500 border-none no-scrollbar max-h-40 overflow-y-auto"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Chappy about the business..."
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="-translate-y-[6.1rem] z-20 absolute right-7 top-1/2 p-0 transform text-indigo-700 hover:bg-inherit hover:text-indigo-500"
                  variant="ghost"
                >
                  {isLoading ? <Loading text="" /> : <SendFilledIcon />}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {currentPdfName !== undefined && (
            <div className="flex items-center justify-center bg-[#f8f8f8] text-slate-700 h-[88vh]">
              Chappy is not configured by the business.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBot;
