"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import SendFilledIcon from "../icons/SendFilledIcon";
import AttachmentIcon from "../icons/AttachmentIcon";
import { Label } from "../ui/Label";

export const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <div className="p-4 bg-indigo-50 flex items-center gap-2">
      <Input
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="flex-grow border rounded-full bg-slate-50 h-11 mr-1 focus-visible:ring-slate-500"
      />

      <div className="text-xl text-slate-800 cursor-pointer p-2 rounded hover:bg-slate-200">
        <SendFilledIcon />
      </div>

      <Label className="text-xl text-slate-800 cursor-pointer p-2 rounded hover:bg-slate-200">
        <AttachmentIcon />
        <Input type="file" className="hidden" />
      </Label>
    </div>
  );
};
