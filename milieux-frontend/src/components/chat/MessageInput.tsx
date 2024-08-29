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
import { broadcastToSocket } from "@/actions/wsActions";

export const MessageInput = () => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const { selectedChat, triggerRefresh, setTriggerRefresh } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendMessage = async () => {
    setIsLoading(true);

    let imagePath = null;

    if (image) {
      const uploadResult = await uploadToCloudinary(image as string, "image");

      if (!uploadResult.success) {
        toast.error("Sending message failed.");
        setIsLoading(false);
        return;
      } else {
        imagePath = uploadResult.url;
      }
    }

    const message = {
      text,
      imagePath,
    };

    const response = await sendMessage({ chatId: selectedChat?.id, message });

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      setTriggerRefresh(!triggerRefresh);
      await broadcastToSocket(selectedChat?.id);
    }

    setIsLoading(false);
    setText("");
    setImage(null);
    revalidateMessage();
  };

  const clearImage = () => {
    setImage(null);
  };

  return (
    <>
      {image && (
        <div className="flex items-center justify-start pl-5 bg-indigo-50">
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

      <div className="p-4 bg-indigo-50 flex items-center gap-2">
        <Input
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-grow border rounded-full bg-slate-50 h-11 mr-1 focus-visible:ring-slate-500"
        />

        <div
          onClick={handleSendMessage}
          className="text-xl text-slate-800 cursor-pointer p-2 rounded hover:bg-slate-200"
        >
          <SendFilledIcon />
        </div>

        <Label className="text-xl text-slate-800 cursor-pointer p-2 rounded hover:bg-slate-200">
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
  );
};
