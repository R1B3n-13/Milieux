import VideoPlayer from "@/components/common/VideoPlayer";
import AvatarIcon from "@/components/icons/AvatarIcon";
import NextFilledIcon from "@/components/icons/NextFilledIcon";
import PreviousFilledIcon from "@/components/icons/PreviousFilledIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import FlashSchema from "@/schemas/flashSchema";
import { getAllFlash, getFlashById } from "@/services/flashService";
import { getUserFromAuthToken } from "@/services/userService";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

const Flash = async ({ id }: { id: number }) => {
  const FlashResponsePromise = getFlashById(id);
  const AllFlashResponsePromise = getAllFlash();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [FlashResponse, AllFlashResponse, loggedInUserResponse] =
    await Promise.all([
      FlashResponsePromise,
      AllFlashResponsePromise,
      loggedInUserResponsePromise,
    ]);

  let index = -1;

  if (AllFlashResponse.success) {
    index = AllFlashResponse.reels.findIndex(
      (flash: z.infer<typeof FlashSchema>) => flash.id === Number(id)
    );
  }

  const handleNavigation = (index: number) => {
    if (AllFlashResponse.success && AllFlashResponse.reels.length > 0) {
      if (index < 0) {
        return AllFlashResponse.reels[AllFlashResponse.reels.length - 1].id;
      } else {
        return AllFlashResponse.reels[index % AllFlashResponse.reels.length].id;
      }
    } else {
      return 0;
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-950">
      <Link href={"/stream"}>
        <button className="absolute top-2 right-2 px-1 rounded-sm bg-red-600 hover:bg-red-500 text-white text-md cursor-pointer">
          ✕
        </button>
      </Link>

      <Card className="relative bg-gray-300 h-[95%] min-w-[32rem] max-w-[32rem]">
        <CardContent className="flex flex-col items-center justify-center h-full py-0 px-0 overflow-hidden rounded-lg">
          {FlashResponse.reel?.imagePath && (
            <Image
              src={FlashResponse.reel.imagePath}
              alt=""
              width={500}
              height={0}
              className="w-full"
            />
          )}

          {FlashResponse.reel?.videoPath && (
            <div className="w-full h-full rounded-lg overflow-hidden">
              <VideoPlayer
                src={FlashResponse.reel.videoPath}
                className="w-full h-full rounded-lg"
                width={500}
                controls
                autoPlay
              />
            </div>
          )}

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {FlashResponse.reel?.user?.isStoreLandingPage ? (
              <a href={`/ecomm?id=${FlashResponse.reel?.user.id}`}>
                <Avatar className="w-12 h-12 cursor-pointer">
                  <AvatarImage src={FlashResponse.reel?.user?.dp as string} />
                  <AvatarFallback className="text-5xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              </a>
            ) : (
              <Link
                href={
                  FlashResponse.reel?.user?.id === loggedInUserResponse.user?.id
                    ? "/persona"
                    : `/persona/${FlashResponse.reel?.user?.id}`
                }
              >
                <Avatar className="w-12 h-12 cursor-pointer">
                  <AvatarImage src={FlashResponse.reel?.user?.dp as string} />
                  <AvatarFallback className="text-5xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            {FlashResponse.reel?.user?.isStoreLandingPage ? (
              <a href={`/ecomm?id=${FlashResponse.reel?.user.id}`}>
                <p className="cursor-pointer text-white font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {FlashResponse.reel?.user.name}
                </p>
              </a>
            ) : (
              <Link
                href={
                  FlashResponse.reel?.user?.id === loggedInUserResponse.user?.id
                    ? "/persona"
                    : `/persona/${FlashResponse.reel?.user?.id}`
                }
              >
                <p className="cursor-pointer text-white font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {FlashResponse.reel?.user.name}
                </p>
              </Link>
            )}
          </div>

          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
            <Link href={`/flashes/${handleNavigation(index - 1)}`}>
              <Button className="rounded-full p-2">
                <PreviousFilledIcon />
              </Button>
            </Link>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
            <Link href={`/flashes/${handleNavigation(index + 1)}`}>
              <Button className="rounded-full p-2">
                <NextFilledIcon />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Flash;
