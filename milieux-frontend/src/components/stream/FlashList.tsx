import FlashSchema from "@/schemas/flashSchema";
import { getAllFlash } from "@/services/flashService";
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
import FlashCarousel from "./FlashCarousel";
import Link from "next/link";

const FlashList = async () => {
  const flashResponse = await getAllFlash();

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
                href="/flash/create"
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

        {flashResponse.success &&
          flashResponse.reels.map((flash: z.infer<typeof FlashSchema>) => (
            <FlashCarousel key={flash.id} flash={flash} />
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FlashList;
