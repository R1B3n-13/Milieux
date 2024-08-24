"use client";

import { SearchBar } from "./SearchBar";
import { ChatList } from "./ChatList";
import UserSchema from "@/schemas/userSchema";
import { z } from "zod";
import { useState } from "react";
import ChatSchema from "@/schemas/chatSchema";

export const ChatSidebar = ({
  chatList,
  loggedInUser,
}: {
  chatList: z.infer<typeof ChatSchema>[];
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const [selectedUser, setSelectedUser] = useState<z.infer<
    typeof UserSchema
  > | null>(null);

  const handleUserUpdate = (user: z.infer<typeof UserSchema>) => {
    setSelectedUser(user);
  };

  return (
    <div className="w-1/4 bg-indigo-100 h-screen flex flex-col border-r border-indigo-200">
      <SearchBar onUserUpdate={handleUserUpdate} />
      <ChatList
        selectedUser={selectedUser}
        chatList={chatList}
        loggedInUser={loggedInUser}
      />
    </div>
  );
};
