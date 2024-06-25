import LeftSideBar from "@/components/stream/LeftSideBar";
import React from "react";

const StreamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
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
