import NavBar from "@/components/social/NavBar";
import React from "react";

const SocialLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav className="mb-3">
        <NavBar />
      </nav>

      <div>{children}</div>
    </>
  );
};

export default SocialLayout;
