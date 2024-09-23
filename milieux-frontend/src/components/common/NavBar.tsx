"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Avatar, AvatarImage } from "../ui/Avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import AvatarIcon from "../icons/AvatarIcon";
import { usePathname, useRouter } from "next/navigation";
import { actionItems, navItems } from "./items/navbarItems";
import Link from "next/link";
import Image from "next/image";
import SearchLineIcon from "../icons/SearchLineIcon";
import AiSearchLineIcon from "../icons/AiSearchLineIcon";
import AiSearchFilledIcon from "../icons/AiSearchFilledIcon";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import AccountSettingsIcon from "../icons/AccountSettingsIcon";
import PrivacySettingsIcon from "../icons/PrivacySettingsIcon";
import HelpCenterIcon from "../icons/HelpCenterIcon";
import LogoutIcon from "../icons/LogoutIcon";
import { logoutUser } from "@/actions/authActions";
import { toast } from "sonner";

const NavBar = ({
  loggedInUser,
}: {
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const [isAiActive, setIsAiActive] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(
        `/search?query=${encodeURIComponent(query)}&forAi=${isAiActive}`
      );
      setQuery("");
    }
  };
  const handleLogout = async () => {
    const response = await logoutUser();

    if (response.success) {
      toast.success(response.message);
      router.push("/login");
    } else {
      toast.error("Error logging out. Please try again.");
      console.error("Error logging out: ", response.message);
    }
  };

  return (
    <div className="grid grid-cols-11 font-medium text-slate-700 transition-all shadow-md bg-[#FAFAFA] px-4">
      <div className="col-span-3">
        <div className="flex py-2 items-center justify-start gap-5">
          <Link className="flex items-center cursor-pointer" href={"/stream"}>
            <Image src="/logo.png" width={38} height={38} alt="" />
          </Link>

          <div className="flex w-full max-w-sm items-center space-x-2 relative">
            <div className="absolute text-xl inset-y-0 left-1 flex items-center pl-4 pointer-events-none">
              <SearchLineIcon />
            </div>
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder={
                isAiActive
                  ? "Search for posts..."
                  : `Search for users, businesses...`
              }
              className="pl-10 rounded-full bg-gray-200 focus-visible:ring-0"
            />
            <div
              className="text-xl cursor-pointer rounded-full p-2 hover:bg-gray-200"
              onClick={() => setIsAiActive(!isAiActive)}
            >
              <div className="text-[1.4rem]">
                {isAiActive ? (
                  <div className="text-emerald-600">
                    <AiSearchFilledIcon />
                  </div>
                ) : (
                  <AiSearchLineIcon />
                )}
              </div>
            </div>
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
            <Link
              key={item.name}
              href={item.path}
              className={`flex rounded-full bg-gray-200 p-2 text-xl items-center justify-center cursor-pointer ${item.iconColor}`}
            >
              {item.icon}
            </Link>
          ))}

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="rounded-full bg-gray-300 p-1 items-center justify-center cursor-pointer">
                  <AvatarImage
                    src={loggedInUser.dp as string}
                    className="rounded-full"
                  />
                  <AvatarFallback className="text-4xl text-stone-600">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="p-2 mx-3 mt-1 w-fit text-slate-800">
                <DropdownMenuLabel className="flex justify-center text-emerald-600 cursor-pointer">
                  {loggedInUser.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-1">
                  <div className="text-xl">
                    <AccountSettingsIcon />
                  </div>
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-1">
                  <div className="text-xl">
                    <PrivacySettingsIcon />
                  </div>
                  Privacy Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-1">
                  <div className="text-xl">
                    <HelpCenterIcon />
                  </div>
                  Help Center
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <div className="text-xl">
                    <LogoutIcon />
                  </div>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
