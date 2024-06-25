import NavBar from "@/components/social/NavBar";
import React from "react";

const StreamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="mb-3">
        <NavBar />
      </nav>

      <div>{children}</div>
    </>
  );
};

export default StreamLayout;
