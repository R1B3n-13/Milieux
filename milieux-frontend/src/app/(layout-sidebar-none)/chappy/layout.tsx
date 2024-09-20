import NavBar from "@/components/common/NavBar";

const ChappyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBar />
      </nav>

      <div className="h-fit">{children}</div>
    </>
  );
};

export default ChappyLayout;
