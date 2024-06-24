import React from "react";
import { Input } from "../ui/Input";
import NotificationLineIcon from "../icons/NotificationLineIcon";
import ChatLineIcon from "../icons/ChatLineIcon";
import { Avatar, AvatarImage } from "../ui/Avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import AvatarIcon from "../icons/AvatarIcon";
import StreamLineIcon from "../icons/StreamLineIcon";
import BusinessLineIcon from "../icons/BusinessLineIcon";
import PersonaLineIcon from "../icons/PersonaLineIcon";
import StreamFilledIcon from "../icons/StreamFilledIcon";
import BusinessFilledIcon from "../icons/BusinessFilledIcon";
import PersonaFilledIcon from "../icons/PersonaFilledIcon";

const NavBar = ({ activeItem }: { activeItem: string }) => {
  return (
    <div className="flex font-medium text-slate-900 transition-all">
      <div className="flex items-center justify-center gap-7">
        <div className="cursor-pointer">logo</div>
        <Input
          type="search"
          className="cursor-pointer hover:border hover:border-gray-500"
        />
      </div>

      <div className="flex ml-auto items-center justify-center gap-7">
        <div
          className={`flex h-full p-2 items-center justify-center gap-2 cursor-pointer ${
            activeItem === "stream" ? "bg-gray-300" : ""
          } ${activeItem !== "stream" ? "hover:bg-gray-200" : ""}`}
        >
          <div className="text-2xl">
            {activeItem === "stream" ? (
              <StreamFilledIcon />
            ) : (
              <StreamLineIcon />
            )}
          </div>
          Stream
        </div>

        <div
          className={`flex h-full p-2 items-center justify-center gap-2 cursor-pointer ${
            activeItem === "businesses" ? "bg-gray-300" : ""
          } ${activeItem !== "businesses" ? "hover:bg-gray-200" : ""}`}
        >
          <div className="text-2xl">
            {activeItem === "businesses" ? (
              <BusinessFilledIcon />
            ) : (
              <BusinessLineIcon />
            )}
          </div>
          Businesses
        </div>

        <div
          className={`flex h-full p-2 items-center justify-center gap-2 cursor-pointer ${
            activeItem === "persona" ? "bg-gray-300" : ""
          } ${activeItem !== "persona" ? "hover:bg-gray-200" : ""}`}
        >
          <div className="text-2xl text-slate-700">
            {activeItem === "persona" ? (
              <PersonaFilledIcon />
            ) : (
              <PersonaLineIcon />
            )}
          </div>
          Persona
        </div>
      </div>

      <div className="flex ml-auto items-center justify-center gap-7">
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <div className="text-3xl text-slate-800">
            <NotificationLineIcon />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <div className="text-3xl text-slate-800">
            <ChatLineIcon />
          </div>
        </div>

        <div>
          <Avatar className="items-center justify-center cursor-pointer">
            <AvatarImage />
            <AvatarFallback className="text-4xl text-gray-600">
              <AvatarIcon />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
