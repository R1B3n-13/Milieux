"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import LeftSidebarItems from "./items/leftSideBarItems";

const LeftSidebar = () => {
  const [activeItem, setActiveItem] = useState(usePathname());

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="flex flex-col gap-3 w-1/2 h-screen border-r border-gray-300 font-medium text-slate-700 transition-all">
      {LeftSidebarItems.map((item) => (
        <div
          key={item.name}
          className={`flex p-2 items-center justify-start gap-2 cursor-pointer ${
            activeItem === item.path ? "bg-gray-300" : "hover:bg-gray-200"
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
  );
};

export default LeftSidebar;
