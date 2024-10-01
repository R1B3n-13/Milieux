"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../ui/Input";
import Image from "next/image";
import SendFilledIcon from "../icons/SendFilledIcon";
import AttachmentIcon from "../icons/AttachmentIcon";
import { Label } from "../ui/Label";
import { useChatContext } from "./ChatContextProvider";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import { toast } from "sonner";
import { sendMessage } from "@/actions/chatActions";
import { revalidateMessage } from "@/actions/revalidationActions";
import Loading from "../common/Loading";
import MessageSchema from "@/schemas/messageSchema";
import { z } from "zod";
import { getChatMessages } from "@/services/chatService";
import { readStreamableValue } from "ai/rsc";
import { chatWithSentiaAi } from "@/actions/aiActions";
import UserSchema from "@/schemas/userSchema";

export const MessageInput = ({
  loggedInUser,
}: {
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const [messages, setMessages] = useState<z.infer<typeof MessageSchema>[]>([]);
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const {
    selectedChat,
    triggerRefresh,
    setTriggerRefresh,
    stompClient,
    setTempMessage,
    chatPersonality,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const fReader = new FileReader();
      fReader.readAsDataURL(file);

      fReader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          setImage(result);
        }
      };
    }
  };

  const uploadImageIfPresent = async (image: string | ArrayBuffer | null) => {
    if (!image) return null;

    const uploadResult = await uploadToCloudinary(image as string, "image");
    if (!uploadResult.success) {
      toast.error("Sending message failed.");
      throw new Error("Image upload failed.");
    }

    return uploadResult.url;
  };

  const handleAiMessage = async (imagePath: string | null) => {
    const messageForAi = {
      text,
      media_url: imagePath,
      history: messages.map((message) => ({
        role: message.user?.id === -1 ? "model" : "user",
        text: message.text || null,
        media_url: message.imagePath || null,
      })),
      personality: chatPersonality,
    };

    const { success, result } = await chatWithSentiaAi(messageForAi);

    if (!success) {
      throw new Error("AI response generation failed.");
    }

    const dummyUser = {
      id: -1,
      isBusiness: null,
      isStoreLandingPage: null,
      name: null,
      email: null,
      dp: null,
      banner: null,
      status: null,
      intro: null,
      address: null,
      userType: null,
      followers: null,
      followings: null,
      createdAt: null,
    };

    setTempMessage((prevMessages) => [
      ...prevMessages,
      { user: dummyUser, text: "Thinking...", imagePath: null },
    ]);

    let textStream = "";
    for await (const delta of readStreamableValue(result)) {
      textStream += delta;

      setTempMessage((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].text = textStream;
        return updatedMessages;
      });
    }

    return textStream;
  };

  const sendAiStreamingMessage = async (streamedText: string) => {
    const aiMessage = {
      text: streamedText,
      imagePath: null,
      messageType: "ai",
    };

    const response = await sendMessage({
      chatId: selectedChat?.id,
      message: aiMessage,
    });

    if (!response.success) {
      throw new Error("Failed to persist AI message.");
    }
  };

  const notifyOtherUsers = (
    chatId: number | undefined | null,
    data: {
      user: z.infer<typeof UserSchema>;
      text: string;
      imagePath: string | null;
    }
  ) => {
    if (stompClient && stompClient.active && stompClient.connected) {
      stompClient!.publish({
        destination: `/app/chat/${chatId}`,
        body: JSON.stringify(data),
      });
    } else {
      toast.error(
        "Lost connection to the chat server. Please refresh the page."
      );
    }
  };

  const resetStateAfterMessageSend = () => {
    setIsLoading(false);
    setText("");
    setImage(null);
    revalidateMessage();
  };

  const handleSendMessage = async () => {
    if (!image && text.trim() === "") return;

    setIsLoading(true);

    try {
      const imagePath = await uploadImageIfPresent(image);

      setTempMessage((prevMessages) => [
        ...prevMessages,
        { user: loggedInUser, text, imagePath },
      ]);

      const isChatWithAi = selectedChat?.users?.some((user) => user.id === -1);

      let streamedText = "";
      if (isChatWithAi) {
        streamedText = await handleAiMessage(imagePath);
      }

      const normalMessage = {
        text,
        imagePath,
        messageType: "normal",
      };

      const response = await sendMessage({
        chatId: selectedChat?.id,
        message: normalMessage,
      });

      if (!response.success) {
        throw new Error("Failed to send message.");
      }

      setTriggerRefresh(!triggerRefresh);

      if (isChatWithAi && streamedText) {
        await sendAiStreamingMessage(streamedText);
      } else {
        notifyOtherUsers(selectedChat?.id, {
          user: loggedInUser,
          text,
          imagePath,
        });
      }
    } catch (error) {
      console.error("Error occurred: " + error);
      toast.error("Something went wrong.");
    } finally {
      resetStateAfterMessageSend();
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {selectedChat && (
        <>
          {image && (
            <div className="flex items-center justify-start pl-5 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200">
              <div className="relative">
                <Image
                  src={image as string}
                  alt=""
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <button
                  className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                  onClick={() => clearImage()}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200 flex items-center gap-2">
            <Input
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-grow border border-violet-400 rounded-full bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200 h-11 mr-1 focus-visible:ring-violet-200"
            />

            <div
              onClick={handleSendMessage}
              className="text-xl text-indigo-700 cursor-pointer p-2 hover:bg-inherit"
            >
              {isLoading ? <Loading text="" /> : <SendFilledIcon />}
            </div>

            <Label className="text-xl text-indigo-700 cursor-pointer p-2 hover:bg-inherit">
              <AttachmentIcon />
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event)}
                className="hidden"
              />
            </Label>
          </div>
        </>
      )}
    </>
  );
};
