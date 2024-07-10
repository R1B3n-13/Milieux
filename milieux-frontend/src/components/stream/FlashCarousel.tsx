import { Card, CardContent } from "@/components/ui/Card";
import { CarouselItem } from "@/components/ui/Carousel";
import FlashSchema from "@/schemas/flashSchema";
import Image from "next/image";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import AvatarIcon from "../icons/AvatarIcon";
import VideoPlayer from "../common/VideoPlayer";

export default function FlashCarousel({
  flash,
}: {
  flash: z.infer<typeof FlashSchema>;
}) {
  return (
    <CarouselItem className="basis-1/5 md:basis-1/4 pl-3">
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
                controls
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <div className="cursor-pointer">
              <Avatar className="w-9 h-9">
                <AvatarImage />
                <AvatarFallback className="text-4xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
            </div>

            <p className="cursor-pointer text-white font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {flash.user?.name}
            </p>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
