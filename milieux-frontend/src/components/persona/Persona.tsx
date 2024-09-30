import Image from "next/image";
import { Button } from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import PersonaPostList from "./PersonaPostList";
import AboutCard from "./AboutCard";
import PostCreationCard from "../common/PostCreationCard";
import PersonaPhotos from "./PersonaPhotos";
import PersonaVideos from "./PersonaVideos";
import EditPersonaDialog from "./EditPersonaDialog";
import UserSchema from "@/schemas/userSchema";
import { getUserFromAuthToken, getUserById } from "@/services/userService";
import { z } from "zod";
import FollowButton from "./FollowButton";
import StoreButton from "./StoreButton";
import Bot2FilledIcon from "../icons/Bot2FilledIcon";
import Link from "next/link";
import EnlargeableImageWrapper from "../common/EnlargeableImageWrapper";
import EditFilledIcon from "../icons/EditFilledIcon";

const Persona = async ({ id }: { id: number | null }) => {
  let user: z.infer<typeof UserSchema> = {};

  const loggedInUserResponse = await getUserFromAuthToken();
  const loggedInUser: z.infer<typeof UserSchema> = loggedInUserResponse.user;

  if (!id && loggedInUserResponse.success) {
    user = loggedInUserResponse.user;
  } else {
    const userResponse = await getUserById(id);
    if (userResponse.success) {
      user = userResponse.user;
    }
  }

  return (
    <>
      {user.id && (
        <div className="flex flex-col mt-5 w-[68%] min-h-screen">
          <div className="relative h-[27rem] w-full z-30">
            {user.banner ? (
              <EnlargeableImageWrapper>
                <Image
                  src={user.banner}
                  alt=""
                  width={2000}
                  height={2000}
                  className="object-fill w-full h-full rounded-t-xl"
                />
              </EnlargeableImageWrapper>
            ) : (
              <EnlargeableImageWrapper>
                <Image
                  src="/banner_placeholder.png"
                  alt=""
                  width={2000}
                  height={2000}
                  className="object-fill w-full h-full rounded-t-xl"
                />
              </EnlargeableImageWrapper>
            )}
          </div>

          <div className="relative w-full flex flex-col items-start justify-center -mt-24 bg-zinc-100 pb-3">
            <div className="flex flex-col items-center justify-center ml-12">
              <div className="relative w-[12rem] h-[12rem] z-40">
                {user.dp ? (
                  <EnlargeableImageWrapper>
                    <Image
                      src={user.dp}
                      alt=""
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full rounded-full border-[6px] border-zinc-100"
                    />
                  </EnlargeableImageWrapper>
                ) : (
                  <EnlargeableImageWrapper>
                    <Image
                      src="/user_placeholder.svg"
                      alt=""
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full border-[6px] bg-zinc-500 border-zinc-100"
                    />
                  </EnlargeableImageWrapper>
                )}
              </div>
              <p className="relative flex items-start justify-start mt-4 text-xl font-semibold">
                {user.name ? user.name : "User Name"}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-end -mt-[8.3rem] mr-12">
            {user.isBusiness && (
              <div className="flex items-center justify-center gap-4 mr-4 z-50">
                <StoreButton id={id} />

                <Link
                  href={`/chappy/${user.id}`}
                  className="w-36 p-[3px] flex items-center justify-center text-slate-800 font-medium rounded-full hover:bg-rose-500 cursor-pointer group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white"
                >
                  <div className="text-xl flex items-center gap-1 justify-center w-full p-1 relative transition-all ease-in duration-75 bg-zinc-100 dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                    <Bot2FilledIcon />
                    <p className="text-base">
                      {user.id === loggedInUser.id
                        ? "Setup Chappy"
                        : "Ask Chappy"}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {user.id === loggedInUser.id ? (
              <EditPersonaDialog
                dialogButton={
                  <div className="flex items-center w-36 p-[3px] text-slate-800 font-medium text-center rounded-full cursor-pointer z-50 group bg-gradient-to-br from-cyan-600 to-blue-500 group-hover:from-cyan-600 group-hover:to-blue-500 hover:text-white dark:text-white">
                    <span className="flex items-center justify-center gap-1 text-xl w-full p-1 relative transition-all ease-in duration-75 bg-zinc-100 dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                      <EditFilledIcon />
                      <p className="text-base">Edit persona</p>
                    </span>
                  </div>
                }
              />
            ) : (
              <FollowButton user={user} loggedInUser={loggedInUser} />
            )}
          </div>

          <Tabs defaultValue="posts" className="w-full mt-[5.25rem] z-40">
            <div className="flex justify-center">
              <TabsList className="gap-5 w-full bg-zinc-100 border-b-2 border-zinc-200 rounded-b-xl p-2">
                <TabsTrigger
                  value="posts"
                  className="w-24 ml-7 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
                >
                  Photos
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
                >
                  Videos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="posts">
              <div className="grid grid-cols-5">
                <div className="col-span-2 mt-2">
                  <AboutCard id={id} />
                </div>
                <div className="col-span-3 flex flex-col items-center justify-start gap-4 mt-2 ml-4">
                  {user.id === loggedInUser.id && <PostCreationCard />}
                  <PersonaPostList id={id} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos">
              <div className="col-span-3 flex flex-col items-center justify-center gap-4 mt-4">
                <PersonaPhotos id={id} />
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="col-span-3 flex flex-col items-center justify-center gap-4 mt-4">
                <PersonaVideos id={id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default Persona;
