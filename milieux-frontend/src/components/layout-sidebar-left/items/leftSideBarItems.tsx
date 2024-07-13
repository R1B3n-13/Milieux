import BookmarkFilledIcon from "@/components/icons/BookmarkFilledIcon";
import BookmarkLineIcon from "@/components/icons/BookmarkLineIcon";
import CommunityFilledIcon from "@/components/icons/CommunityFilledIcon";
import CommunityLineIcon from "@/components/icons/CommunityLineIcon";
import FollowersFilledIcon from "@/components/icons/FollowersFilledIcon";
import FollowersLineIcon from "@/components/icons/FollowersLineIcon";
import FollowingsFilledIcons from "@/components/icons/FollowingsFilledIcon";
import FollowingsLineIcon from "@/components/icons/FollowingsLineIcon";
import GaminFilledIcon from "@/components/icons/GamingFilledIcon";
import GamingLineIcon from "@/components/icons/GamingLineIcon";
import KidFilledIcon from "@/components/icons/KidFilledIcon";
import KidLineIcon from "@/components/icons/KidLineIcon";
import ListFilledIcon from "@/components/icons/ListFilledIcon";
import ListLineIcon from "@/components/icons/ListLineIcon";
import MemoryFilledIcon from "@/components/icons/MemoryFilledIcon";
import MemoryLineIcon from "@/components/icons/MemoryLineIcon";
import VideoFilledIcon from "@/components/icons/VideoFilledIcon";
import VideoLineIcon from "@/components/icons/VideoLineIcon";

const leftSidebarItems = [
  {
    name: "Followings",
    path: "/followings",
    lineIcon: <FollowingsLineIcon />,
    filledIcon: <FollowingsFilledIcons />,
    iconColor: "text-sky-600",
  },
  {
    name: "Followers",
    path: "/followers",
    lineIcon: <FollowersLineIcon />,
    filledIcon: <FollowersFilledIcon />,
    iconColor: "text-cyan-600",
  },
  {
    name: "Communities",
    path: "/communities",
    lineIcon: <CommunityLineIcon />,
    filledIcon: <CommunityFilledIcon />,
    iconColor: "text-emerald-600",
  },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    lineIcon: <BookmarkLineIcon />,
    filledIcon: <BookmarkFilledIcon />,
    iconColor: "text-blue-600",
  },
  {
    name: "Videos",
    path: "/videos",
    lineIcon: <VideoLineIcon />,
    filledIcon: <VideoFilledIcon />,
    iconColor: "text-rose-600",
  },
  {
    name: "Lists",
    path: "/lists",
    lineIcon: <ListLineIcon />,
    filledIcon: <ListFilledIcon />,
    iconColor: "text-amber-700",
  },
  {
    name: "Memories",
    path: "/memories",
    lineIcon: <MemoryLineIcon />,
    filledIcon: <MemoryFilledIcon />,
    iconColor: "text-teal-600",
  },
  {
    name: "Gaming",
    path: "/gaming",
    lineIcon: <GamingLineIcon />,
    filledIcon: <GaminFilledIcon />,
    iconColor: "text-purple-600",
  },
  {
    name: "Kids",
    path: "/kids",
    lineIcon: <KidLineIcon />,
    filledIcon: <KidFilledIcon />,
    iconColor: "text-yellow-800",
  },
];

export default leftSidebarItems;
