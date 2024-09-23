import NavBarContainer from "@/components/common/NavBarContainer";

const PersonaLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <nav>
        <NavBarContainer />
      </nav>

      <div>{children}</div>
    </>
  );
};

export default PersonaLayout;
