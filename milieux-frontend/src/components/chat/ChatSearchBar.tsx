"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "../ui/Input";
import SearchLineIcon from "../icons/SearchLineIcon";
import { searchUsers } from "@/services/searchService";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";
import AvatarIcon from "../icons/AvatarIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { useChatContext } from "./ChatContextProvider";
import { createChat } from "@/actions/chatActions";
import { revalidateChat } from "@/actions/revalidationActions";

export const ChatSearchBar = () => {
  const [users, setUsers] = useState<z.infer<typeof UserSchema>[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { setSelectedChat } = useChatContext();

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    if (query.trim() === "") {
      setShowDropdown(false);
      setUsers([]);
      return;
    }

    const response = await searchUsers(query);

    if (response.success) {
      setUsers(response.users);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleChatSelect = async (user: z.infer<typeof UserSchema>) => {
    const response = await createChat(user.id);

    if (response.success) {
      setSelectedChat(response.chat);
      revalidateChat();
    }

    setShowDropdown(false);
  };

  return (
    <div className="relative flex flex-col items-center p-4">
      <div className="w-full flex items-center relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchLineIcon />
        </div>
        <Input
          type="search"
          placeholder="Search users..."
          onChange={handleSearchChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onFocus={() => users.length > 0 && setShowDropdown(true)}
          className="w-full pl-9 rounded-full border border-violet-400 bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-200 h-10 focus-visible:ring-violet-200"
        />
      </div>

      {showDropdown && users.length > 0 && (
        <div className="absolute mt-11 w-[90%] p-2 bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-100 border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleChatSelect(user)}
              className="cursor-pointer p-2 hover:bg-gradient-to-r hover:from-indigo-100 hover:via-violet-100 hover:to-indigo-200 hover:rounded-lg flex items-center space-x-3"
            >
              <Avatar className="rounded-full p-1 items-center justify-center cursor-pointer">
                <AvatarImage
                  src={user.id === -1 ? "/sentia.png" : (user.dp as string)}
                  className="rounded-full"
                />
                <AvatarFallback className="text-4xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
