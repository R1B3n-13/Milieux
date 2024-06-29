import LeftSideBar from "@/components/stream/LeftSideBar";
import RightSideBar from "@/components/stream/RightSideBar";
import React from "react";

const StreamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid grid-cols-11">
        <div className="col-span-3">
          <LeftSideBar />
        </div>

        <div className="col-span-4">{children}</div>

        <div className="col-span-4">
          <RightSideBar />
        </div>
      </div>
    </>
  );
};

export default StreamLayout;
