"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import leftSidebarItems from "./items/leftSideBarItems";

const LeftSidebar = () => {
  const [activeItem, setActiveItem] = useState(usePathname());

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="flex flex-col gap-3 w-2/3 h-screen border-r shadow-sm text-slate-700 transition-all">
      <div className="h-5" />
      {leftSidebarItems.map((item) => (
        <div
          key={item.name}
          className={`flex rounded-lg px-3 py-3 mx-3 items-center justify-start gap-4 cursor-pointer ${
            activeItem === item.path ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
          onClick={() => handleItemClick(item.path)}
        >
          <div className={`text-3xl ${item.iconColor}`}>
            {activeItem === item.path ? item.filledIcon : item.lineIcon}
          </div>
          <p className="font-semibold">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
