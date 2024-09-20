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
import { getAiChatParams } from "@/services/aiService";
import { defaultSystemInstruction } from "./items/defaultSystemInstruction";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  let aiChatParams: z.infer<typeof AiChatParamsSchema> = {
    temperature: 0.8,
    topP: 0.8,
    topK: 60,
    systemInstruction: defaultSystemInstruction,
  };

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
  }, []);

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
    };

    setChatHistory([
      ...chatHistory,
      { role: "user", parts: query },
      { role: "model", parts: "" },
    ]);

    setQuery("");

    console.log("data: " + data.temperature);

    const { result } = await askCustomChatbot(data);

    let textStream = "";

    for await (const delta of readStreamableValue(result)) {
      textStream += delta;

      setChatHistory((prevChatHistory) => {
        const newChatHistory = [...prevChatHistory];
        newChatHistory[newChatHistory.length - 1].parts = textStream;
        return newChatHistory;
      });
    }

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
        <>
          <ScrollArea
            ref={scrollAreaRef}
            className="bg-violet-200 rounded-lg py-7 px-20 w-full h-full max-h-[700px] overflow-y-auto z-10"
          >
            {chatHistory.map((chat, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-end">
                  {chat.role === "user" && (
                    <div className="flex items-center gap-3 text-sm text-slate-700 bg-gray-50 p-2 rounded-lg w-fit max-w-[40rem] break-words">
                      <div className="text-2xl text-slate-800 bg-violet-200 p-1 rounded-full">
                        <PersonLineIcon />
                      </div>
                      {chat.parts}
                    </div>
                  )}
                </div>
                {chat.role === "model" && (
                  <div className="flex items-center gap-3 text-slate-700 text-sm p-2 rounded-lg w-fit mt-1">
                    <div className="text-2xl text-black bg-gray-50 p-1 rounded-full">
                      <BotLineIcon />
                    </div>
                    {chat.parts ? (
                      <MarkdownRenderer text={chat.parts} />
                    ) : (
                      "Thinking..."
                    )}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
          <div className="relative flex items-center justify-center p-4">
            <TextArea
              className="flex items-center justify-center pl-5 pr-11 py-[0.9rem] resize-none rounded-full min-h-0 h-12 bg-violet-100 border-none no-scrollbar max-h-40 overflow-y-auto"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Chappy about the business..."
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="absolute right-7 top-1/2 p-0 transform -translate-y-1/2 text-indigo-500 rounded-full"
              variant="ghost"
            >
              {isLoading ? <Loading text="" /> : <SendFilledIcon />}
            </Button>
          </div>
        </>
      ) : (
        <>
          {currentPdfName !== undefined && (
            <div className="flex items-center justify-center text-slate-700 h-[88vh]">
              Chappy is not configured by the business.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBot;
