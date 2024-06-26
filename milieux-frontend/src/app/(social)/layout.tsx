import NavBar from "@/components/social/NavBar";
import React from "react";

const SocialLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBar />
      </nav>

      <div>{children}</div>
    </>
  );
};

export default SocialLayout;
