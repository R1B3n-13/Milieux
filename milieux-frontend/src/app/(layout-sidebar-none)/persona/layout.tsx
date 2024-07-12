import NavBar from "@/components/common/NavBar";

const PersonaLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBar />
      </nav>

      <div>{children}</div>
    </>
  );
};

export default PersonaLayout;
