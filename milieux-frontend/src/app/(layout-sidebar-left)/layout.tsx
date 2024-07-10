import NavBar from "@/components/social/NavBar";
import LeftSideBar from "@/components/social/LeftSideBar";
import React from "react";

const SidebarLeftLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBar />
      </nav>

      <div className="grid grid-cols-11">
        <div className="col-span-2">
          <LeftSideBar />
        </div>

        <div className="col-span-9">{children}</div>
      </div>
    </>
  );
};

export default SidebarLeftLayout;
