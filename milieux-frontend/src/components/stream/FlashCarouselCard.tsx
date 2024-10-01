"use client";

import FlashSchema from "@/schemas/flashSchema";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import AvatarIcon from "@/components/icons/AvatarIcon";
import Link from "next/link";
import VideoPlayer from "../common/VideoPlayer";
import { Card, CardContent } from "../ui/Card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FlashCarouselCard = ({
  flash,
  userId,
}: {
  flash: z.infer<typeof FlashSchema>;
  userId: number;
}) => {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/flashes/${flash.id}`)}>
      <Card className="relative bg-gray-200">
        <CardContent className="flex items-center h-56 py-0 px-0 cursor-pointer">
          {flash.imagePath && (
            <Image
              src={flash.imagePath}
              alt=""
              width={1000}
              height={0}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
          {flash.videoPath && (
            <div className="w-full h-full rounded-lg overflow-hidden">
              <VideoPlayer
                src={flash.videoPath}
                width={1000}
                controls={false}
                className="w-full h-full object-cover"
                autoPlay={false}
              />
            </div>
          )}

          <div className="absolute top-2 left-2 cursor-pointer">
            {flash.user?.isStoreLandingPage ? (
              <a href={`/ecomm?id=${flash.user.id}`}>
                <Avatar className="w-9 h-9">
                  <AvatarImage src={flash.user?.dp as string} />
                  <AvatarFallback className="text-5xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              </a>
            ) : (
              <Link
                href={
                  flash.user?.id === userId
                    ? "/persona"
                    : `/persona/${flash.user?.id}`
                }
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage src={flash.user?.dp as string} />
                  <AvatarFallback className="text-4xl text-gray-500">
                    <AvatarIcon />
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>

          {flash.user?.isStoreLandingPage ? (
            <a
              href={`/ecomm?id=${flash.user.id}`}
              className="absolute w-full flex justify-center bottom-1 justify-self-center cursor-pointer text-sm font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            >
              {flash.user?.name}
            </a>
          ) : (
            <Link
              href={
                flash.user?.id === userId
                  ? "/persona"
                  : `/persona/${flash.user?.id}`
              }
              className="absolute w-full flex justify-center bottom-1 justify-self-center cursor-pointer text-sm font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            >
              {flash.user?.name}
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashCarouselCard;
