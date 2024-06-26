import LeftSideBar from "@/components/stream/LeftSideBar";
import RightSideBar from "@/components/stream/RightSideBar";
import React from "react";

const StreamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid grid-cols-3">
        <div>
          <LeftSideBar />
        </div>

        <div>{children}</div>

        <div>
          <RightSideBar />
        </div>
      </div>
    </>
  );
};

export default StreamLayout;
