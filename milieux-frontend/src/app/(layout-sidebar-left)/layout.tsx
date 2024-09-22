import NavBarContainer from "@/components/common/NavBarContainer";
import LeftSideBar from "@/components/layout-sidebar-left/LeftSideBar";
import React from "react";

const SidebarLeftLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBarContainer />
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
