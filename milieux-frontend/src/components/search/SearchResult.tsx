import { searchUsers } from "@/services/searchService";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import AvatarIcon from "../icons/AvatarIcon";
import FollowersFilledIcon from "../icons/FollowersFilledIcon";
import MailFilledIcon from "../icons/MailFilledIcon";
import FollowingsFilledIcon from "../icons/FollowingsFilledIcon";

const SearchResult = async ({ query }: { query: string }) => {
  const searchResponse = await searchUsers(query);

  let searchedUsers: z.infer<typeof UserSchema>[] = [];

  if (searchResponse.success) {
    searchedUsers = searchResponse.users;
  }

  const casualUsers = searchedUsers.filter((user) => !user.isBusiness);
  const businessUsers = searchedUsers.filter((user) => user.isBusiness);

  return (
    <Tabs defaultValue="casual" className="w-full py-5 px-96">
      <div className="flex items-center justify-center">
        <TabsList className="gap-5 w-fit grid-cols-2 bg-gray-200">
          <TabsTrigger value="casual" className="w-24">
            People
          </TabsTrigger>
          <TabsTrigger value="business" className="w-24">
            Businesses
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="casual">
        {casualUsers.map((user) => (
          <Card key={user.id} className="mb-4 bg-[#FEFEFE]">
            <CardHeader className="flex items-center justify-center gap-1 pt-2 pb-1">
              <Avatar className="w-16 h-16 cursor-pointer">
                <AvatarImage />
                <AvatarFallback>
                  <div className="text-stone-600 text-7xl">
                    <AvatarIcon />
                  </div>
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-black cursor-pointer">
                {user.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center text-sm gap-7 justify-center text-gray-600 pb-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="text-lg text-pink-600">
                  <MailFilledIcon />
                </div>
                <p>{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-lg text-teal-600">
                  <FollowersFilledIcon />
                </div>
                <p>{user.followers?.length || 0}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-lg text-sky-600">
                  <FollowingsFilledIcon />
                </div>
                <p>{user.followings?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="business">
        {businessUsers.map((user) => (
          <Card key={user.id} className="mb-4 bg-[#FEFEFE]">
            <CardHeader className="flex items-center justify-center gap-1 pt-2 pb-1">
              <Avatar className="w-16 h-16 cursor-pointer">
                <AvatarImage />
                <AvatarFallback>
                  <div className="text-stone-600 text-7xl">
                    <AvatarIcon />
                  </div>
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-black cursor-pointer">
                {user.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center text-sm gap-7 justify-center text-gray-600 pb-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="text-lg text-pink-600">
                  <MailFilledIcon />
                </div>
                <p>{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-lg text-teal-600">
                  <FollowersFilledIcon />
                </div>
                <p>{user.followers?.length || 0}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-lg text-sky-600">
                  <FollowingsFilledIcon />
                </div>
                <p>{user.followings?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default SearchResult;
