import FlashSchema from "@/schemas/flashSchema";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/Carousel";
import PlusFilledIcon from "../icons/PlusFilledIcon";
import { Card, CardContent } from "../ui/Card";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "../common/VideoPlayer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import AvatarIcon from "../icons/AvatarIcon";

const FlashCarousel = ({
  flashes,
}: {
  flashes: z.infer<typeof FlashSchema>[];
}) => {
  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      className="flex items-center justify-center mt-5 w-full max-w-5xl"
    >
      <CarouselContent className="-ml-3">
        <CarouselItem className="basis-1/5 md:basis-1/4 pl-3">
          <Card className="relative overflow-hidden bg-gray-50">
            <CardContent className="flex flex-col h-56 items-center justify-center px-0">
              <div className="w-full">
                <Image
                  src="/user_placeholder.svg"
                  alt=""
                  width={500}
                  height={500}
                  className="translate-y-6"
                />
              </div>

              <Link
                href="/flashes/create"
                className="text-blue-600 bg-white translate-y-1 rounded-full border-4 border-white cursor-pointer"
              >
                <PlusFilledIcon />
              </Link>

              <p className="font-semibold translate-y-2 text-sm cursor-default">
                Create a flash
              </p>
            </CardContent>
          </Card>
        </CarouselItem>

        {flashes.map((flash: z.infer<typeof FlashSchema>, index) => (
          <CarouselItem key={flash.id} className="basis-1/5 md:basis-1/4 pl-3">
            {" "}
            <Link href={`/flashes/${flash.id}`}>
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
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FlashCarousel;
