import { LoadingSpinner } from "../ui/LoadingSpinner";

const Loading = ({ text }: { readonly text: string }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <LoadingSpinner />
      <p>{text}</p>
    </div>
  );
};

export default Loading;
