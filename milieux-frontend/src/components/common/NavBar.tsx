"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Avatar, AvatarImage } from "../ui/Avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import AvatarIcon from "../icons/AvatarIcon";
import { usePathname, useRouter } from "next/navigation";
import { actionItems, navItems } from "./items/navbarItems";
import Logo from "../common/Logo";
import Link from "next/link";
import SearchLineIcon from "../icons/SearchLineIcon";

const NavBar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    <div className="grid grid-cols-11 font-medium text-slate-700 transition-all shadow-md bg-white px-4">
      <div className="col-span-3">
        <div className="flex py-2 items-center justify-start gap-7">
          <div className="cursor-pointer">
            <Logo />
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <SearchLineIcon />
            </div>
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Search for users, businesses..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="col-span-4 content-center">
        <div className="flex h-full items-center justify-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex h-full px-7 items-center justify-center gap-2 cursor-pointer ${
                activeItem === item.path
                  ? "border-b-[3px] border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <div
                className={`text-2xl ${
                  activeItem === item.path ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {activeItem === item.path ? item.filledIcon : item.lineIcon}
              </div>
            </Link>
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