import BookmarkFilledIcon from "@/components/icons/BookmarkFilledIcon";
import BookmarkLineIcon from "@/components/icons/BookmarkLineIcon";
import CommunityFilledIcon from "@/components/icons/CommunityFilledIcon";
import CommunityLineIcon from "@/components/icons/CommunityLineIcon";
import FollowersFilledIcon from "@/components/icons/FollowersFilledIcon";
import FollowersLineIcon from "@/components/icons/FollowersLineIcon";
import FollowingsFilledIcons from "@/components/icons/FollowingsFilledIcons";
import FollowingsLineIcon from "@/components/icons/FollowingsLineIcon";
import GaminFilledIcon from "@/components/icons/GaminFilledIcon";
import GamingLineIcon from "@/components/icons/GamingLineIcon";
import KidFilledIcon from "@/components/icons/KidFilledIcon";
import KidLineIcon from "@/components/icons/KidLineIcon";
import ListFilledIcon from "@/components/icons/ListFilledIcon";
import ListLineIcon from "@/components/icons/ListLineIcon";
import MemoryFilledIcon from "@/components/icons/MemoryFilledIcon";
import MemoryLineIcon from "@/components/icons/MemoryLineIcon";
import VideoFilledIcon from "@/components/icons/VideoFilledIcon";
import VideoLineIcon from "@/components/icons/VideoLineIcon";

const LeftSidebarItems = [
  {
    name: "Followings",
    path: "/followings",
    lineIcon: <FollowingsLineIcon />,
    filledIcon: <FollowingsFilledIcons />,
  },
  {
    name: "Followers",
    path: "/followers",
    lineIcon: <FollowersLineIcon />,
    filledIcon: <FollowersFilledIcon />,
  },
  {
    name: "Communities",
    path: "/communities",
    lineIcon: <CommunityLineIcon />,
    filledIcon: <CommunityFilledIcon />,
  },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    lineIcon: <BookmarkLineIcon />,
    filledIcon: <BookmarkFilledIcon />,
  },
  {
    name: "Videos",
    path: "/videos",
    lineIcon: <VideoLineIcon />,
    filledIcon: <VideoFilledIcon />,
  },
  {
    name: "Lists",
    path: "/lists",
    lineIcon: <ListLineIcon />,
    filledIcon: <ListFilledIcon />,
  },
  {
    name: "Memories",
    path: "/memories",
    lineIcon: <MemoryLineIcon />,
    filledIcon: <MemoryFilledIcon />,
  },
  {
    name: "Gaming",
    path: "/gaming",
    lineIcon: <GamingLineIcon />,
    filledIcon: <GaminFilledIcon />,
  },
  {
    name: "Kids",
    path: "/kids",
    lineIcon: <KidLineIcon />,
    filledIcon: <KidFilledIcon />,
  },
];

export default LeftSidebarItems;
