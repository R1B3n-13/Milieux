import BookmarkedPostList from "@/components/bookmarks/BookmarkedPostList";

const BookmarkPage = () => {
  return (
    <div className="flex flex-col px-40 h-screen overflow-y-auto no-scrollbar mt-4 gap-4">
      <BookmarkedPostList />
    </div>
  );
};

export default BookmarkPage;
