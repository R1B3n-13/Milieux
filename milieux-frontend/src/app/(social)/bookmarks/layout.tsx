const BookmarksLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid grid-cols-9 mt-5">
        <div className="col-span-6">{children}</div>

        <div className="col-span-3" />
      </div>
    </>
  );
};

export default BookmarksLayout;
