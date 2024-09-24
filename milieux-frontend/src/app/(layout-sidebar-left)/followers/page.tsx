import FollowersList from "@/components/followers/FollowersList";

const FollowersPage = () => {
  return (
    <div className="grid grid-cols-9 mt-1">
      <div className="col-span-6 px-40 mt-4">
        <FollowersList />
      </div>

      <div className="col-span-3" />
    </div>
  );
};

export default FollowersPage;
