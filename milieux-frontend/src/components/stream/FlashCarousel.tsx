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
import UserSchema from "@/schemas/userSchema";
import FlashCarouselCard from "./FlashCarouselCard";

const FlashCarousel = ({
  flashes,
  user,
}: {
  flashes: z.infer<typeof FlashSchema>[];
  user: z.infer<typeof UserSchema>;
}) => {
  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      className="flex items-center justify-center mt-5 w-full max-w-5xl"
    >
      <CarouselContent className="-ml-3">
        <CarouselItem className="basis-1/5 md:basis-1/4 pl-3">
          <Card className="relative overflow-hidden bg-[#FEFEFE]">
            <CardContent className="flex flex-col h-56 items-center justify-center px-0">
              <div className="w-full h-full">
                {user.dp ? (
                  <Image
                    src={user.dp}
                    alt=""
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/user_placeholder.svg"
                    alt=""
                    width={500}
                    height={500}
                  />
                )}
              </div>

              <Link
                href="/flashes/create"
                className="text-blue-600 bg-white -translate-y-5 rounded-full border-4 border-white cursor-pointer"
              >
                <PlusFilledIcon />
              </Link>

              <p className="font-semibold -translate-y-1 text-sm cursor-default">
                Create a flash
              </p>
            </CardContent>
          </Card>
        </CarouselItem>

        {flashes.map((flash: z.infer<typeof FlashSchema>) => (
          <CarouselItem key={flash.id} className="basis-1/5 md:basis-1/4 pl-3">
            {user.id && <FlashCarouselCard flash={flash} userId={user.id} />}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FlashCarousel;
