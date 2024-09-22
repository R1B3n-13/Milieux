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
import Link from "next/link";
import AddressIcon from "../icons/AddressIcon";
import StatusIcon from "../icons/StatusIcon";
import { getUserFromAuthToken } from "@/services/userService";

const SearchResult = async ({ query }: { query: string }) => {
  const searchPromise = searchUsers(query);
  const loggedInUserPromise = getUserFromAuthToken();

  const [searchResponse, loggedInUserResponse] = await Promise.all([
    searchPromise,
    loggedInUserPromise,
  ]);

  let searchedUsers: z.infer<typeof UserSchema>[] = [];
  const loggedInUser: z.infer<typeof UserSchema> = loggedInUserResponse.user;

  if (searchResponse.success) {
    searchedUsers = searchResponse.users;
  }

  const casualUsers = searchedUsers.filter((user) => !user.isBusiness);
  const businessUsers = searchedUsers.filter((user) => user.isBusiness);

  return (
    <>
      <div className="mt-5 ml-7 flex items-center gap-1 text-lg text-slate-800">
        Showing results for : <p className="font-semibold">{query}</p>{" "}
      </div>
      <Tabs defaultValue="casual" className="w-full pb-5 pt-3 px-[26rem]">
        <div className="flex items-center justify-center">
          <TabsList className="gap-7 w-fit bg-[#f8f8f8] border-b-2 border-zinc-200 rounded-none py-2 px-0 mb-2">
            <TabsTrigger
              value="casual"
              className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
            >
              People
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
            >
              Businesses
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="casual">
          {casualUsers.map((user) => (
            <Card key={user.id} className="mb-4 bg-[#FEFEFE]">
              <CardContent className="grid grid-cols-5 text-sm text-gray-600 py-2 px-5">
                <div className=" col-span-2 flex flex-col items-center justify-evenly -ml-10">
                  {user?.isStoreLandingPage ? (
                    <a href={`/ecomm?id=${user.id}`}>
                      <Avatar className="w-10 h-10 cursor-pointer mb-1">
                        <AvatarImage src={user?.dp as string} />
                        <AvatarFallback>
                          <div className="text-stone-600 text-5xl">
                            <AvatarIcon />
                          </div>
                        </AvatarFallback>
                      </Avatar>
                    </a>
                  ) : (
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
                  )}

                  {user?.isStoreLandingPage ? (
                    <a href={`/ecomm?id=${user.id}`}>
                      <CardTitle className="text-slate-700 cursor-pointer font-semibold text-sm">
                        {user.name}
                      </CardTitle>
                    </a>
                  ) : (
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
                  )}
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
        </TabsContent>

        <TabsContent value="business">
          {businessUsers.map((user) => (
            <Card key={user.id} className="mb-4 bg-[#FEFEFE]">
              <CardContent className="grid grid-cols-5 text-sm text-gray-600 py-2 px-5">
                <div className=" col-span-2 flex flex-col items-center justify-evenly -ml-10">
                  {user?.isStoreLandingPage ? (
                    <a href={`/ecomm?id=${user.id}`}>
                      <Avatar className="w-10 h-10 cursor-pointer mb-1">
                        <AvatarImage src={user?.dp as string} />
                        <AvatarFallback>
                          <div className="text-stone-600 text-5xl">
                            <AvatarIcon />
                          </div>
                        </AvatarFallback>
                      </Avatar>
                    </a>
                  ) : (
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
                  )}

                  {user?.isStoreLandingPage ? (
                    <a href={`/ecomm?id=${user.id}`}>
                      <CardTitle className="text-slate-700 cursor-pointer font-semibold text-sm">
                        {user.name}
                      </CardTitle>
                    </a>
                  ) : (
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
                  )}
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
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SearchResult;
