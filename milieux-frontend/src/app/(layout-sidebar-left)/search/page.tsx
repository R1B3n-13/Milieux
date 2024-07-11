import SearchResult from "@/components/search/SearchResult";

const SearchPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <SearchResult query={searchParams.query as string} />;
};

export default SearchPage;
