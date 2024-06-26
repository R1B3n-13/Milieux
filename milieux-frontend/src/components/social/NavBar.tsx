"use client";

import { useState } from "react";
import { Input } from "../ui/Input";
import { Avatar, AvatarImage } from "../ui/Avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import AvatarIcon from "../icons/AvatarIcon";
import { usePathname } from "next/navigation";
import { actionItems, navItems } from "./items/navbarItems";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState(usePathname());

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="flex font-medium text-slate-700 transition-all bg-muted py-2 px-4">
      <div className="flex items-center justify-center gap-7">
        <div className="cursor-pointer">logo</div>
        <Input
          type="search"
          className="cursor-pointer hover:border hover:border-gray-500"
        />
      </div>

      <div className="flex ml-auto items-center justify-center gap-7">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`flex h-full p-2 items-center justify-center gap-2 cursor-pointer ${
              activeItem === item.path
                ? "bg-gray-200 shadow-md border border-slate-300"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleItemClick(item.path)}
          >
            <div className="text-2xl">
              {activeItem === item.path ? item.filledIcon : item.lineIcon}
            </div>
            {item.name}
          </div>
        ))}
      </div>

      <div className="flex ml-auto items-center justify-center gap-7">
        {actionItems.map((item) => (
          <div
            key={item.name}
            className="flex text-3xl items-center justify-center gap-2 cursor-pointer"
          >
            {item.icon}
          </div>
        ))}

        <div>
          <Avatar className="items-center justify-center cursor-pointer">
            <AvatarImage />
            <AvatarFallback className="text-4xl text-gray-500">
              <AvatarIcon />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
