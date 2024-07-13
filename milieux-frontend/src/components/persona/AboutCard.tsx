import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import UserSchema from "@/schemas/userSchema";
import { getUserById, getUserFromAuthToken } from "@/services/userService";
import months from "@/utils/months";
import StatusIcon from "../icons/StatusIcon";
import IntroIcon from "../icons/IntroIcon";
import AddressIcon from "../icons/AddressIcon";
import FollowersFilledIcon from "../icons/FollowersFilledIcon";
import FollowingsFilledIcons from "../icons/FollowingsFilledIcon";
import MailFilledIcon from "../icons/MailFilledIcon";
import ClockIcon from "../icons/ClockIcon";

const AboutCard = async ({ id }: { id: number | null }) => {
  let user: z.infer<typeof UserSchema> = {};

  if (!id) {
    const loggedInUserResponse = await getUserFromAuthToken();
    if (loggedInUserResponse.success) {
      user = loggedInUserResponse.user;
    }
  } else {
    const userResponse = await getUserById(id);
    if (userResponse.success) {
      user = userResponse.user;
    }
  }

  let date = null;
  if (user.createdAt) {
    date = new Date(user.createdAt);
  }

  return (
    <Card className="w-full p-4 text-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {user.intro && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              <IntroIcon />
            </h4>
            <p className="text-gray-600">{user.intro}</p>
          </div>
        )}

        {user.status && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              <StatusIcon />
            </h4>
            <p className="text-gray-600">{user.status}</p>
          </div>
        )}

        {user.address && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              <AddressIcon />
            </h4>
            <p className="text-gray-600">Lives at {user.address}</p>
          </div>
        )}

        {user.followers && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-lg">
              <FollowersFilledIcon />
            </h4>
            <p className="text-gray-600">Followed by {user.followers.length}</p>
          </div>
        )}

        {user.followings && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-lg">
              <FollowingsFilledIcons />
            </h4>
            <p className="text-gray-600">Following {user.followings.length}</p>
          </div>
        )}

        {user.email && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              <MailFilledIcon />
            </h4>
            <p className="text-gray-600">{user.email}</p>
          </div>
        )}

        {user.createdAt && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              <ClockIcon />
            </h4>
            <p className="text-gray-600">
              Joined At {date?.getDate()} {months[date?.getMonth() || 0]}
              {", "}
              {date?.getFullYear()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutCard;
