import NavBarContainer from "@/components/common/NavBarContainer";

const ChappyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBarContainer />
      </nav>

      <div className="h-screen">{children}</div>
    </>
  );
};

export default ChappyLayout;
