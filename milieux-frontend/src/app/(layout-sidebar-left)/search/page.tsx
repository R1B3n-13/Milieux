import AiSearchResult from "@/components/search/AiSearchResult";
import SearchResult from "@/components/search/SearchResult";

const SearchPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <>
      {searchParams.forAi === "true" ? (
        <div className="grid grid-cols-9 mt-1">
          <div className="col-span-6 h-screen overflow-y-auto no-scrollbar">
            <AiSearchResult
              query={searchParams.query as string}
              image_url={searchParams.imageUrl as string}
            />
          </div>

          <div className="col-span-3" />
        </div>
      ) : (
        <div className="col-span-6 h-screen overflow-y-auto no-scrollbar">
          <SearchResult query={searchParams.query as string} />
        </div>
      )}
    </>
  );
};

export default SearchPage;
