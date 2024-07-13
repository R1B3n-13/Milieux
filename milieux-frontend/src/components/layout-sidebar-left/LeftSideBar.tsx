"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import leftSidebarItems from "./items/leftSideBarItems";
import Link from "next/link";

const LeftSidebar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <div className="flex flex-col gap-3 w-full h-screen border-r shadow-sm text-slate-700 transition-all">
      <div className="h-5" />
      {leftSidebarItems.map((item) => (
        <Link
          key={item.name}
          href={item.path}
          className={`flex rounded-lg px-3 py-3 mx-3 items-center justify-start gap-4 cursor-pointer ${
            activeItem === item.path ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
        >
          <div className={`text-3xl ${item.iconColor}`}>
            {activeItem === item.path ? item.filledIcon : item.lineIcon}
          </div>
          <p className="font-semibold">{item.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default LeftSidebar;
