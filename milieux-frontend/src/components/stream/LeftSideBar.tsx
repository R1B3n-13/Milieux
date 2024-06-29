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
    <div className="flex flex-col gap-3 w-2/3 h-screen bg-muted font-medium text-slate-700 transition-all">
      <div className="h-3" />
      {leftSidebarItems.map((item) => (
        <div
          key={item.name}
          className={`flex px-6 py-3 items-center justify-start gap-4 cursor-pointer ${
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
