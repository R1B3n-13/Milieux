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

const ChatBot = ({ userId }: { userId: number | null | undefined }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "model"; parts: string }[]
  >([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (query.trim() === "" || !userId) return;

    setIsLoading(true);

    const data = {
      query,
      userId,
      history: chatHistory,
    };

    setChatHistory([
      ...chatHistory,
      { role: "user", parts: query },
      { role: "model", parts: "" },
    ]);

    setQuery("");

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
    <div className="bg-white h-full p-3 w-full flex flex-col rounded-lg shadow-md">
      <ScrollArea
        ref={scrollAreaRef}
        className="bg-white py-7 px-20 w-full max-h-[700px] overflow-y-auto z-10"
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-end">
              {chat.role === "user" && (
                <div className="flex items-center gap-3 text-sm text-slate-700 bg-indigo-50 p-2 rounded-lg w-fit max-w-[40rem] break-words">
                  <div className="text-2xl text-slate-800 bg-indigo-200 p-1 rounded-full">
                    <PersonLineIcon />
                  </div>
                  {chat.parts}
                </div>
              )}
            </div>
            {chat.role === "model" && (
              <div className="flex items-center gap-3 text-slate-700 text-sm p-2 rounded-lg w-fit mt-1">
                <div className="text-2xl text-black bg-gray-200 p-1 rounded-full">
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
          className="flex items-center justify-center pl-5 pr-11 py-[0.9rem] resize-none rounded-full min-h-0 h-12 bg-indigo-50 border-none no-scrollbar max-h-40 overflow-y-auto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Chappy about the business..."
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="absolute right-7 top-1/2 p-0 transform -translate-y-1/2 text-indigo-500 rounded-full hover:text-indigo-500 hover:bg-indigo-50"
          variant="ghost"
        >
          {isLoading ? <Loading text="" /> : <SendFilledIcon />}
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;
