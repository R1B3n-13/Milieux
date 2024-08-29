import BusinessFilledIcon from "../../icons/BusinessFilledIcon";
import BusinessLineIcon from "../../icons/BusinessLineIcon";
import ChatLineIcon from "../../icons/ChatLineIcon";
import NotificationLineIcon from "../../icons/NotificationLineIcon";
import PersonaFilledIcon from "../../icons/PersonaFilledIcon";
import PersonaLineIcon from "../../icons/PersonaLineIcon";
import StreamFilledIcon from "../../icons/StreamFilledIcon";
import StreamLineIcon from "../../icons/StreamLineIcon";

export const navItems = [
  {
    name: "Stream",
    path: "/stream",
    lineIcon: <StreamLineIcon />,
    filledIcon: <StreamFilledIcon />,
  },
  {
    name: "Businesses",
    path: "/businesses",
    lineIcon: <BusinessLineIcon />,
    filledIcon: <BusinessFilledIcon />,
  },
  {
    name: "Persona",
    path: "/persona",
    lineIcon: <PersonaLineIcon />,
    filledIcon: <PersonaFilledIcon />,
  },
];

export const actionItems = [
  {
    name: "Notification",
    path: "",
    icon: <NotificationLineIcon />,
    iconColor: "text-rose-600",
  },
  {
    name: "Chat",
    path: "/chat",
    icon: <ChatLineIcon />,
    iconColor: "text-blue-600",
  },
];
