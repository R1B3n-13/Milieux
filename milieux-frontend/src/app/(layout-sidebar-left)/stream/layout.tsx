import RightSideBar from "@/components/stream/RightSideBar";

const StreamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid grid-cols-9 mt-1">
        <div className="col-span-6">{children}</div>

        <div className="col-span-3">
          <RightSideBar />
        </div>
      </div>
    </>
  );
};

export default StreamLayout;
