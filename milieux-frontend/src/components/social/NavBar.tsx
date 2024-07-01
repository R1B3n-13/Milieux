"use client";

import { useState } from "react";
import { Input } from "../ui/Input";
import { Avatar, AvatarImage } from "../ui/Avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import AvatarIcon from "../icons/AvatarIcon";
import { usePathname } from "next/navigation";
import { actionItems, navItems } from "./items/navbarItems";
import Logo from "../common/Logo";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState(usePathname());

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="grid grid-cols-11 font-medium text-slate-700 transition-all shadow-md bg-white px-4">
      <div className="col-span-3">
        <div className="flex py-2 items-center justify-start gap-7">
          <div className="cursor-pointer">
            <Logo />
          </div>
          <Input
            type="search"
            className="cursor-pointer w-60 border-gray-200 hover:border hover:border-gray-300"
          />
        </div>
      </div>

      <div className="col-span-4 content-center">
        <div className="flex h-full items-center justify-center gap-12">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={`flex h-full px-7 items-center justify-center gap-2 cursor-pointer ${
                activeItem === item.path
                  ? "border-b-[3px] border-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleItemClick(item.path)}
            >
              <div
                className={`text-2xl ${
                  activeItem === item.path ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {activeItem === item.path ? item.filledIcon : item.lineIcon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 content-center">
        <div className="flex items-center justify-end gap-5">
          {actionItems.map((item) => (
            <div
              key={item.name}
              className={`flex rounded-full bg-gray-200 p-2 text-xl items-center justify-center cursor-pointer ${item.iconColor}`}
            >
              {item.icon}
            </div>
          ))}

          <div>
            <Avatar className="rounded-full bg-gray-200 p-1 items-center justify-center cursor-pointer">
              <AvatarImage />
              <AvatarFallback className="text-4xl text-stone-600">
                <AvatarIcon />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
