import { searchUsers } from "@/services/searchService";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AvatarIcon from "../icons/AvatarIcon";
import FollowersFilledIcon from "../icons/FollowersFilledIcon";
import MailFilledIcon from "../icons/MailFilledIcon";
import FollowingsFilledIcon from "../icons/FollowingsFilledIcon";
import { getBusinessUsers } from "@/services/businessService";
import AddressIcon from "../icons/AddressIcon";
import StatusIcon from "../icons/StatusIcon";
import { getUserFromAuthToken } from "@/services/userService";
import Link from "next/link";

const BusinessList = async () => {
  const businessUserPromise = getBusinessUsers();
  const loggedInUserPromise = getUserFromAuthToken();

  const [businessUserResponse, loggedInUserResponse] = await Promise.all([
    businessUserPromise,
    loggedInUserPromise,
  ]);

  let businessUsers: z.infer<typeof UserSchema>[] = [];
  const loggedInUser: z.infer<typeof UserSchema> = loggedInUserResponse.user;

  if (businessUserResponse.success) {
    businessUsers = businessUserResponse.users;
  }
  return (
    <>
      {businessUsers.map((user) => (
        <Card key={user.id} className="mb-4 bg-[#FEFEFE]">
          <CardContent className="grid grid-cols-5 text-sm text-gray-600 py-2 px-5">
            <div className=" col-span-2 flex flex-col items-center justify-evenly -ml-10">
              <Link
                href={
                  user?.id === loggedInUser.id
                    ? "/persona"
                    : `/persona/${user?.id}`
                }
              >
                <Avatar className="w-10 h-10 cursor-pointer mb-1">
                  <AvatarImage src={user?.dp as string} />
                  <AvatarFallback>
                    <div className="text-stone-600 text-5xl">
                      <AvatarIcon />
                    </div>
                  </AvatarFallback>
                </Avatar>
              </Link>

              <Link
                href={
                  user?.id === loggedInUser.id
                    ? "/persona"
                    : `/persona/${user?.id}`
                }
              >
                <CardTitle className="text-slate-700 cursor-pointer font-semibold text-sm">
                  {user.name}
                </CardTitle>
              </Link>
            </div>

            <div className="col-span-3 flex flex-col justify-evenly">
              {user.status && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-lg text-blue-900">
                    <StatusIcon />
                  </div>
                  <p>{user.status}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-1">
                <div className="text-lg text-pink-900">
                  <MailFilledIcon />
                </div>
                <p>{user.email}</p>
              </div>

              {user.address && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-[0.96rem] text-amber-900">
                    <AddressIcon />
                  </div>
                  <p>{user.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default BusinessList;
