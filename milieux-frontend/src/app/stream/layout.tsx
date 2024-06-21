import LeftSideBar from "@/components/stream/LeftSideBar";
import NavBar from "@/components/stream/NavBar";
import React from "react";

const StreamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="mb-10">
        <NavBar />
      </nav>

      <div className="grid grid-cols-3">
        <div>
          <LeftSideBar />
        </div>

        <div>{children}</div>

        <div>03</div>
      </div>
    </>
  );
};

export default StreamLayout;
